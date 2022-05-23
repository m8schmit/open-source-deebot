import VacBot_950type from 'ecovacs-deebot/types/library/950type/vacBot';
import VacBot_non950type from 'ecovacs-deebot/types/library/non950type/vacBot';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

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
  setDefaultEvent('GetAutoEmpty');

  socket.on('setAutoEmpty', (payload) => {
    logEvent('receive', 'setAutoEmpty', payload);
    let autoEmptyStatus = 0;
    if (payload) {
      autoEmptyStatus = 1;
    }
    logEvent('send', 'setAutoEmpty', autoEmptyStatus);
    socket.emit('setAutoEmpty', autoEmptyStatus);
  });

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
