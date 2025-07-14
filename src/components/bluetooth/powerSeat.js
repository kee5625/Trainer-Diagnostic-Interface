import { writeCommand, setNotifyCallback, onBleNotify } from './core';

export const readAlias = (alias) => writeCommand([0x00, alias, 0x00]);

export const subscribeAll = ()      => writeCommand([0x01, 0xff, 0x00]);

export const requestDTC   = (alias)      => writeCommand([0x00, alias, 0x00]);

export const clearCodes   = ()      => writeCommand([0x00, 0x02, 0x00]);

export const fetchFrozen = () => writeCommand([]);

export const requestStatus = () => writeCommand([0x10]); //byte code for requesting data

// (A) receive 5-byte ASCII DTC -> string "P0304"
export function onDtc(cb){
    return onBleNotify(raw => {
        if(raw.length !== 5) return;
        cb(new TextDecoder().decode(raw).trim());
    });
}

// (B) receive 2-byte seat status 
export function onSeatStatus(cb){
    return onBleNotify(raw => {
        const [flags, dir] = raw;
        cb({
            ignition: !!(flags & 1),
            lumbar: !!(flags & 2),
            seat: ['NEUTRAL', 'UP', 'DOWN', 'LEFT', 'RIGHT'][dir] ?? "UNKNOWN",
        });
    });
}

export const setNotifyCallbackCompat = setNotifyCallback;