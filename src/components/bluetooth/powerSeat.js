import { writeCommand, onBleNotify } from "./core";

export const CMD_PENDING = 0x01;
export const CMD_STORED = 0x02;
export const CMD_PERM = 0x03;
export const CMD_CLEAR = 0x04;
export const CMD_STATUS = 0x05;
export const CMD_LIVE_TOGGLE = 0x06;

export const requestDTC = (cmd = CMD_PENDING) => writeCommand([cmd]);
export const clearCodes = () => writeCommand([CMD_CLEAR]);
export const requestStatus = () => writeCommand([CMD_STATUS]);
export function requestLiveToggle() {
    // send toggle on or off cmd
    writeCommand([CMD_LIVE_TOGGLE]);
    return () => writeCommand([CMD_LIVE_TOGGLE]);
}

/*  PIDs sent by the ESP32 (see TWAI_OBD.h)
 *    0xA0  ignition   (0/1)
 *    0xA1  adjuster   (0-4  → dir text)
 *    0xA2  lumbar     (0-4  → dir text)
 */
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
    let buf = []; //running list
    return onBleNotify(raw => {
        /* 0xCC means "clear done" */
        if(raw.length === 1 && raw[0] === 0xCC){
            buf = [];
            cb({cleared: true, list:[]});
            return;
        }

        if(raw.length % 2) return;  // malformed → ignore
        const list = [];
        for(let i = 0; i < raw.length; i+=2){
            buf.push(decodeDtc(raw[i], raw[i+1]));
        }

        //last chunk is <20 B ->flush
        if (raw.length < 20) {
            cb({ cleared: false, list: buf });
            buf = [];
        }

    });
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

