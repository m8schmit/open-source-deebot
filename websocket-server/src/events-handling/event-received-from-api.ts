import VacBot_950type from 'ecovacs-deebot/types/library/950type/vacBot';
import VacBot_non950type from 'ecovacs-deebot/types/library/non950type/vacBot';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { logEvent } from '../utils/logger.utils';

export const eventsReceivedFromAPI = (
  vacBot: VacBot_950type | VacBot_non950type,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const setDefaultEvent = (
    eventName: string,
    transformPayload?: (payload: any) => string | boolean
  ) =>
    vacBot.on(eventName, (payload: any) => {
      if (transformPayload) {
        payload = transformPayload(payload);
      }
      logEvent('send', eventName, payload);
      socket.emit(eventName, payload);
    });
    
  setDefaultEvent('AutoEmpty', (val) => val === 1 ? true : false);
  setDefaultEvent('ChargeState');
  setDefaultEvent('BatteryInfo');
  setDefaultEvent('CleanReport');
  setDefaultEvent('WaterBoxInfo');
  setDefaultEvent('Schedule', (val) => JSON.stringify(val));
  setDefaultEvent('MapDataObject', (val) => JSON.stringify(val));
  setDefaultEvent('MapImage', (val) => val['mapBase64PNG']);


  vacBot.on('Maps', ({ maps }: any) => {
    const mapID = maps.find(
      (currentMap: any) => currentMap.mapIsCurrentMap === true
    ).mapID;
    logEvent('send', '[GetMapImage, GetVirtualBoundaries]', { maps, mapID });
    vacBot.run('GetMapImage', mapID);
    vacBot.run('GetVirtualBoundaries', mapID);
  });
};
