// trainers/power-seat/index.js
import hero from '../../assets/power_seat_trainer.webp';
import cardImg from '../../assets/bg_power_seat.png';
import * as CMD from '../../core/ble/commands';

export default {
  id:        'gmlan-network',
  name:      'GMLAN Network',
  hero,
  cardImg,
  gapPrefix: 'Trainer-GM',

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
