import { useEffect, useState, useCallback } from 'react';
import * as ble from './core';

export function useBle(gapPrefix) {
  const [state, setState] = useState({ connected: false, notifying: false });

  const connect    = useCallback(() => ble.connectBle({ gapPrefix }), [gapPrefix]);
  const disconnect = ble.disconnectBle;

  useEffect(() => ble.onBleState(setState), []);

  return { ...state, connect, disconnect };
}
