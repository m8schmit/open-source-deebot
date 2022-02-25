import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import VacBot_950type from '../../types/ecovacs-deebot/library/950type/vacBot';
import VacBot_non950type from '../../types/ecovacs-deebot/library/non950type/vacBot';
import { logEvent } from '../utils/logger.utils';

export const eventsReceivedFromFrontend = (
  vacBot: VacBot_950type | VacBot_non950type,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const setDefaultEvent = (eventName: string) =>
    socket.on(eventName, (payload: any) => {
      logEvent('receive', eventName, payload);
      vacBot.run(eventName);
    });

  setDefaultEvent('Clean');
  setDefaultEvent('Charge');
  setDefaultEvent('Pause');
  setDefaultEvent('GetBatteryState');
  setDefaultEvent('GetChargeState');
  setDefaultEvent('GetCleanState');

  socket.on('getName', (payload) => {
    logEvent('receive', 'getName', payload);
    const name = {
      model: vacBot.getDeviceProperty('name'),
      name: vacBot.ecovacs.bot.vacuum.nick,
    };
    logEvent('send', 'NickName', name);
    socket.emit('NickName', name);
  });

  socket.on('GetMaps', (payload) => {
    logEvent('receive', 'GetMaps', payload);
    const createMapDataObject = true; // default = false
    const createMapImage = false; // default = createMapDataObject && vacBot.isMapImageSupported();
    vacBot.run('GetMaps', createMapDataObject, createMapImage);
  });
};
