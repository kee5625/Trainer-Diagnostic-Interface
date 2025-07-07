let device = null;
let server = null;
let tx = null;
let rx = null;

let notifyCb = () => {};

const SERVICE_UUID = '0000abcd-0000-1000-8000-00805f9b34fb';
const CHAR_UUID_TX = '0000ab01-0000-1000-8000-00805f9b34fb';
const CHAR_UUID_RX = '0000ab02-0000-1000-8000-00805f9b34fb';
const GAP_NAME_PREF = 'Trainer-';

const listeners = new Set();
function publishState(s) {
  bleState = {...s};                         // remember latest
  listeners.forEach(l => l({...s}));
}
let bleState = { connected:false, notifying:false };

export function onBleState(cb) {
  cb(bleState);                         // <─ immediate replay
  listeners.add(cb);  
  return () => listeners.delete(cb);
}

async function startNotifyWithRetry(ch) {
  const transient = ["NotSupportedError", "InvalidStateError", "NetworkError"];
  let tries = 0;
  while (true) {
    try {
      console.log("startNotifications → try", ++tries);
      await ch.startNotifications();
      console.log("startNotifications → SUCCESS");
      return;                       // success
    } catch (err) {
      console.warn("startNotifications →", err.name);
      if (!(err instanceof DOMException) || !transient.includes(err.name))
        throw err;                  // fatal → bubble out
      await new Promise(r => setTimeout(r, 100));   // retry
    }
  }
}

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

    publishState({ connected: true, notifying: false});

    await startNotifyWithRetry(rx);
    rx.addEventListener('characteristicvaluechanged', onNotify);

    publishState({ connected: true, notifying: true });
    console.log('Device Connected');
    return true;
  } catch (e) {
    console.error("[BLE] connect failed:", e);
    clearRefs();
    publishState({ connected: false, notifying: false });
    return false;
  }
}

function clearRefs() {
  if (rx) rx.removeEventListener('characteristicvaluechanged', onNotify);
  device = server = tx = rx = null;
}

export async function disconnectBle() {
  const d = device;
  if (!d){
    publishState({ connected: false, notifying: false });
    return;
  }

  if (!d.gatt?.connected) {
    clearRefs();
    publishState({ connected: false, notifying: false });
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
  publishState({ connected: false, notifying: false });
}

let opChain = Promise.resolve();
export function enqueue(op) {
  opChain = opChain.then(op, op);
  return opChain;
}

export function setNotifyCallback(cb) {
  notifyCb = cb;
}

export function writeCommand(cmd) {
  if (!tx) throw new Error('BLE not ready');
  return enqueue(() =>{
    console.log("TX →", cmd.map(b => "0x"+b.toString(16).padStart(2,"0")));
    return tx.writeValueWithoutResponse(new Uint8Array(cmd));
  });
}

function onNotify(e) {
  const v = e.target.value;
  const ascii = new TextDecoder().decode(
    new Uint8Array(v.buffer, v.byteOffset, v.byteLength)
  ).trim();
  notifyCb?.(ascii);
}
