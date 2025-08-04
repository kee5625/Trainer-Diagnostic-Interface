import { writeCommand, onBleNotify } from "./core";

export const CMD_PENDING = 0x01;
export const CMD_STORED = 0x02;
export const CMD_PERM = 0x03;
export const CMD_CLEAR = 0x04;
export const CMD_STATUS = 0x05;
export const CMD_LIVE_START  = 0x06;
export const CMD_LIVE_STOP   = 0x07;

export const requestDTC = (cmd = CMD_PENDING) => writeCommand([cmd]);
export const clearCodes = () => writeCommand([CMD_CLEAR]);
export const requestStatus = (pids = []) => writeCommand([CMD_STATUS, ...pids]);

export function requestLiveStart() {
    // send toggle on 
    return writeCommand([CMD_LIVE_START]);
}

export function requestLiveStop() {
    return writeCommand([CMD_LIVE_STOP]);
}

const DIR = ['NEUTRAL', 'UP', 'DOWN', 'LEFT', 'RIGHT'];


/* DTC helper: */
function decodeDtc(hi, lo){
    const sys = ['P', 'C', 'B', 'U'][hi >> 6];
    const dig1 = ((hi >> 4) & 0x03).toString(16).toUpperCase();
    const dig2 = (hi & 0x0F).toString(16).toUpperCase();
    const dig3 = (lo >> 4).toString(16).toUpperCase();
    const dig4 = (lo & 0x0F).toString(16).toUpperCase();
    return sys + dig1 +dig2 + dig3 + dig4;
}

/* notifcation fan-out */
export function onDtc(cb){
  let buf = []
  return onBleNotify(raw => {
    // 0xCC = “clear done”
    if (raw.length === 1 && raw[0] === 0xCC) {
      buf = []
      cb({ cleared: true, list: [] })
      return
    }
    // ignore odd lengths
    if (raw.length % 2) return

    // accumulate pairs
    for (let i = 0; i < raw.length; i += 2) {
      buf.push(decodeDtc(raw[i], raw[i+1]))
    }

    // final chunk (<20 bytes) → flush buffer
    if (raw.length < 20) {
      cb({ cleared: false, list: buf })
      buf = []
    }
  })
}

// (B) receive 2-byte seat status 
let seatState = { ignition:false, seat:'NEUTRAL', lumbar:'NEUTRAL' };

export function onSeatStatus(cb){
    return onBleNotify(raw => {
        for (let i = 0; i < raw.length - 1; i += 2) {
            const pid = raw[i], val = raw[i+1];
            switch (pid) {
                case 0xA0: seatState.ignition = !!val;           break;
                case 0xA1: seatState.seat     = DIR[val] ?? '?'; break;
                case 0xA2: seatState.lumbar   = DIR[val] ?? '?'; break;
            }
        }
        cb({...seatState});
    });
}




export function subscribeAll(period = 500) {
    const timer = setInterval(requestStatus, period);
    return () => clearInterval(timer);
}