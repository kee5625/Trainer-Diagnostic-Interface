// ─────────────────────────────────────────────────────────────────────────────
// Generic BLE helper (multi-subscriber notify queue)
// ─────────────────────────────────────────────────────────────────────────────
let device   = null;
let server   = null;
let tx       = null;
let rx       = null;

/* -------- state fan-out -------- */
const bleListeners = new Set();
let bleState = { connected: false, notifying: false };
function publishState(s) {
  bleState = { ...s };
  bleListeners.forEach(l => l({ ...s }));
}

export function onBleState(cb) {
  cb(bleState);               // replay immediately
  bleListeners.add(cb);
  return () => bleListeners.delete(cb);
}

/* -------- notify fan-out -------- */
const notifySubs = new Set();
export function onBleNotify(fn) {
  notifySubs.add(fn);
  return () => notifySubs.delete(fn);
}
/* Back-compat single-callback setter (used by legacy code) */
export function setNotifyCallback(cb) {
  notifySubs.clear();
  notifySubs.add(cb);
}

/* -------------------------------------------------------------------------- */
const SERVICE_UUID   = '0000abcd-0000-1000-8000-00805f9b34fb';
const CHAR_UUID_TX   = '0000ab01-0000-1000-8000-00805f9b34fb';
const CHAR_UUID_RX   = '0000ab02-0000-1000-8000-00805f9b34fb';
const GAP_NAME_PREF  = 'Trainer-';

async function startNotifyWithRetry(ch) {
  const transient = ['NotSupportedError', 'InvalidStateError', 'NetworkError'];
  let attempt = 0;
  for (;;) {
    try {
      console.log('startNotifications attempt', ++attempt);
      await ch.startNotifications();
      return;
    } catch (e) {
      if (
        !(e instanceof DOMException) ||
        !transient.includes(e.name)
      )
        throw e;                         // non-transient → bubble
      await new Promise(r => setTimeout(r, 100));
    }
  }
}

/* ── Connect ──────────────────────────────────────────────────────────────── */
export async function connectBle() {
  try {
    device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: GAP_NAME_PREF }],
      optionalServices: [SERVICE_UUID],
    });

    device.addEventListener('gattserverdisconnected', () => {
      clearRefs();
      publishState({ connected: false, notifying: false });
    });

    server = device.gatt.connected ? device.gatt : await device.gatt.connect();
    const svc = await server.getPrimaryService(SERVICE_UUID);
    tx = await svc.getCharacteristic(CHAR_UUID_TX);
    rx = await svc.getCharacteristic(CHAR_UUID_RX);

    publishState({ connected: true, notifying: false });

    await startNotifyWithRetry(rx);
    rx.addEventListener('characteristicvaluechanged', onNotify);
    publishState({ connected: true, notifying: true });

    console.log('BLE connected');
    return true;
  } catch (e) {
    console.error('[BLE] connect failed', e);
    clearRefs();
    publishState({ connected: false, notifying: false });
    return false;
  }
}

/* ── Disconnect ──────────────────────────────────────────────────────────── */
export async function disconnectBle() {
  if (!device) {
    publishState({ connected: false, notifying: false });
    return;
  }
  if (!device.gatt?.connected) {
    clearRefs();
    publishState({ connected: false, notifying: false });
    return;
  }
  await new Promise(res => {
    const target = device;
    const done = () => {
      target && target.removeEventListener('gattserverdisconnected', done);
      res();
    };
    target.addEventListener('gattserverdisconnected', done, { once: true });
    target.gatt.disconnect();
  });
  clearRefs();
  publishState({ connected: false, notifying: false });
}

function clearRefs() {
  if (rx) rx.removeEventListener('characteristicvaluechanged', onNotify);
  device = server = tx = rx = null;
}

/* ── Write queue (prevents overlapped writes) ─────────────────────────────── */
let opChain = Promise.resolve();
export function enqueue(op) {
  opChain = opChain.then(op, op);
  return opChain;
}
export function writeCommand(bytes) {
  if (!tx) throw new Error('BLE not ready');
  return enqueue(() => {
    console.log(
      'TX →',
      bytes.map(b => '0x' + b.toString(16).padStart(2, '0'))
    );
    return tx.writeValueWithoutResponse(new Uint8Array(bytes));
  });
}

/* ── Internal notify handler (raw bytes) ──────────────────────────────────── */
function onNotify(e) {
  const raw = new Uint8Array(
    e.target.value.buffer,
    e.target.value.byteOffset,
    e.target.value.byteLength
  );
  notifySubs.forEach(cb => cb(raw));
}
