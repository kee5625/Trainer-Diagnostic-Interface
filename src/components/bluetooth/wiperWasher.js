import { writeCommand } from './core';

export const readData = async () => {
  await writeCommand("PS_READ_DATA_CMD");
};

export const readCodes = async () => {
  await writeCommand("PS_READ_CODES_CMD");
};

export const clearCodes = async () => {
  await writeCommand("PS_CLEAR_CODES_CMD");
};
