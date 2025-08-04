// trainers/air-conditioner/index.js
import hero from '../../assets/ac_trainer.webp';
import cardImg from '../../assets/bg_ac.png';
import * as CMD from '../../core/ble/commands';

export default {
  id:        'air-conditioner',
  name:      'Air Conditioner',
  hero,
  cardImg,
  gapPrefix: 'Trainer-AC',

  // optional overrides
  components: {
    Home:      null,
    ReadData:  null,
    ReadCodes: null,
  },

  // BLE helpers wrapped so UI stays protocol-agnostic
  ble: {
    readCodes:  () => [CMD.CMD_PENDING],
    clearCodes: () => [CMD.CMD_CLEAR],
    status:     () => [CMD.CMD_STATUS],
    liveStart:  () => [CMD.CMD_LIVE_START],
    liveStop:   () => [CMD.CMD_LIVE_STOP],
  },
};
