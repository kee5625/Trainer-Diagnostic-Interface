// trainers/wiper-washer/index.js
import hero from "../../assets/wiper_washer_trainer.webp"
import cardImg from '../../assets/bg_wiper_washer.png';
import * as CMD from '../../core/ble/commands';

export default {
  id:        'wiper-washer',
  name:      'Wiper Washer',
  hero,
  cardImg,
  gapPrefix: 'Trainer-WW',

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
