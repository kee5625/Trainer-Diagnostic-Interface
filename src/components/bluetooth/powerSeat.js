import { writeCommand, onBleNotify } from "./core";

export const CMD_PENDING = 0x01;
export const CMD_STORED = 0x02;
export const CMD_PERM = 0x03;
export const CMD_CLEAR = 0x04;

export const requestDTC = (cmd = CMD_PENDING) => writeCommand([cmd]);
export const clearCodes = () => writeCommand([CMD_CLEAR]);


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
export function onSeatStatus(cb){
    return onBleNotify(raw => {
        const [flags, dir] = raw;
        cb({
            ignition: !!(flags & 1),
            lumbar: ['NEUTRAL', 'UP', 'DOWN', 'LEFT', 'RIGHT'][dir] ?? "UNKNOWN",
            seat: ['NEUTRAL', 'UP', 'DOWN', 'LEFT', 'RIGHT'][dir] ?? "UNKNOWN",
        });
    });
}
