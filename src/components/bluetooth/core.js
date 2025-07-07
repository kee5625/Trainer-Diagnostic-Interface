let device = null;
let server = null;
let tx = null;
let rx = null;

let notifyCb = null;

const SERVICE_UUID = '0000abcd-0000-1000-8000-00805f9b34fb';
const CHAR_UUID_TX = '0000ab01-0000-1000-8000-00805f9b34fb';
const CHAR_UUID_RX = '0000ab02-0000-1000-8000-00805f9b34fb';
const GAP_NAME_PREF = 'Trainer-';

export async function connectBle() {
  try {
    device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: GAP_NAME_PREF }],
      optionalServices: [SERVICE_UUID],
    });

    server = await device.gatt.connect();
    const svc = await server.getPrimaryService(SERVICE_UUID);

    tx = await svc.getCharacteristic(CHAR_UUID_TX);
    rx = await svc.getCharacteristic(CHAR_UUID_RX);

    // await rx.startNotifications();
    // rx.addEventListener('characteristicvaluechanged', onNotify);

    console.log('Device Connected');
    return true;
  } catch (e) {
    console.error('[BLE] connect failed', e);
    clearRefs();
    return false;
  }
}

function clearRefs() {
  if (rx) rx.removeEventListener('characteristicvaluechanged', onNotify);
  device = server = tx = rx = null;
}

export async function disconnectBle() {
  const d = device;
  if (!d) return;

  if (!d.gatt?.connected) {
    clearRefs();
    return;
  }

  await new Promise((resolve) => {
    const done = () => {
      d.removeEventListener('gattserverdisconnected', done);
      resolve();
    };
    d.addEventListener('gattserverdisconnected', done, { once: true });
    d.gatt.disconnect();
    console.log('Device Disconnected');
  });

  clearRefs();
}

let opChain = Promise.resolve();
function enqueue(op) {
  opChain = opChain.then(op, op);
  return opChain;
}

export function setNotifyCallback(cb) {
  notifyCb = cb;
}

export function writeCommand(cmd) {
  if (!tx) throw new Error('BLE not ready');
  return enqueue(() =>
    tx.writeValueWithoutResponse(new Uint8Array(cmd))
  );
}

function onNotify(e) {
  const v = e.target.value;
  const ascii = new TextDecoder().decode(
    new Uint8Array(v.buffer, v.byteOffset, v.byteLength)
  ).trim();
  notifyCb?.(ascii);
}
