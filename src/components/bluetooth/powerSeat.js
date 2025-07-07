import { writeCommand, enqueue } from './core';

export function readAlias(alias) {
  return enqueue(() =>
    writeCommand([0x00, alias, 0x00])
  );
}

export function subscribeAll() {
  return enqueue(() =>
    writeCommand([0x01, 0xff, 0x00])
  );
}

export function requestDTC() {
  return enqueue(() =>
    writeCommand([0x01])
  );
}

export const clearCodes = async () => {
  await writeCommand([0x00, 0x02, 0x00]);
};
