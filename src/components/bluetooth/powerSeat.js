import { writeCommand, requestDTC, subscribeAll, readAlias } from './core';

export const readData = async (alias) => {
  await readAlias(alias);  // example command bytes
};

export const streamData = async () => {
  await subscribeAll();
};

export const readCodes = async () => {
  await requestDTC();  // example command bytes
};

export const clearCodes = async () => {
  await writeCommand([0x00, 0x02, 0x00]);  // example command bytes
};
