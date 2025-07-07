import { writeCommand } from './core';

export const readAlias = (alias) => writeCommand([0x00, alias, 0x00]);

export const subscribeAll = ()      => writeCommand([0x01, 0xff, 0x00]);

export const requestDTC   = (alias)      => writeCommand([0x00, alias, 0x00]);

export const clearCodes   = ()      => writeCommand([0x00, 0x02, 0x00]);