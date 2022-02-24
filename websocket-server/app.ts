import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectToDeebot } from './ecovacs-mqtt.js';
import VacBot_950type from './types/ecovacs-deebot/library/950type/vacBot.js';
import VacBot_non950type from './types/ecovacs-deebot/library/non950type/vacBot.js';

dotenv.config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

const port = 8081;

connectToDeebot().then((vacbot) => {
  io.on('connection', (socket) => {
    console.log('New client connected');
    console.log(socket.id);
    vacbot.run('GetChargeState');
    vacbot.run('GetBatteryState');
    vacbot.run('GetCleanState');
    vacbot.run('GetSchedule');
    vacbot.run('GetWaterBoxInfo');

    vacbot.on('ChargeState', (state: any) => {
      logEvent('send', 'ChargeState', state);
      socket.emit('ChargeState', state);
    });

    vacbot.on('BatteryInfo', (state: any) => {
      logEvent('send', 'BatteryInfo', state);

      socket.emit('BatteryInfo', state);
    });

    vacbot.on('CleanReport', (state: any) => {
      logEvent('send', 'CleanReport', state);
      socket.emit('CleanReport', state);
    });

    vacbot.on('Schedule', (payload: any) => {
      logEvent('send', 'Schedule', JSON.stringify(payload));
      socket.emit('Schedule', JSON.stringify(payload));
    });

    vacbot.on('WaterBoxInfo', (payload: any) => {
      logEvent('send', 'WaterBoxInfo', payload);
      socket.emit('WaterBoxInfo', payload);
    });

    vacbot.on('Maps', ({ maps }: any) => {
      const mapID = maps.find(
        (currentMap: any) => currentMap.mapIsCurrentMap === true
      ).mapID;
      logEvent('receive', 'Maps', { maps, mapID });
      vacbot.run('GetMapImage', mapID);
      vacbot.run('GetVirtualBoundaries', mapID);
    });

    vacbot.on('MapDataObject', (mapDataObject: any) => {
      logEvent('send', 'MapDataObject', JSON.stringify(mapDataObject));
    });

    vacbot.on('MapImage', (payload: any) => {
      logEvent('send', 'MapImage', payload['mapBase64PNG']);
      socket.emit('MapImage', payload['mapBase64PNG']);
    });

    socket.on('getName', (payload) => {
      logEvent('receive', 'getName', payload);
      const name = {
        model: vacbot.getDeviceProperty('name'),
        name: vacbot.ecovacs.bot.vacuum.nick,
      };
      logEvent('send', 'NickName', name);
      socket.emit('NickName', name);
    });

    socket.on('Clean', (payload) => {
      logEvent('receive', 'Clean', payload);
      vacbot.run('Clean');
    });

    socket.on('Charge', (payload) => {
      logEvent('receive', 'Charge', payload);
      vacbot.run('Charge');
    });

    socket.on('Pause', (payload) => {
      logEvent('receive', 'Pause', payload);
      vacbot.run('Pause');
    });

    socket.on('GetBatteryState', (payload) => {
      logEvent('receive', 'GetBatteryState', payload);
      vacbot.run('GetBatteryState');
    });

    socket.on('GetChargeState', (payload) => {
      logEvent('receive', 'GetChargeState', payload);
      vacbot.run('GetChargeState');
    });

    socket.on('GetCleanState', (payload) => {
      logEvent('receive', 'GetCleanState', payload);
      vacbot.run('GetCleanState');
    });

    socket.on('GetMaps', (payload) => {
      logEvent('receive', 'GetMaps', payload);
      const createMapDataObject = true; // default = false
      const createMapImage = false; // default = createMapDataObject && vacbot.isMapImageSupported();
      vacbot.run('GetMaps', createMapDataObject, createMapImage);
    });
  });

  // TODO
  // process.on('SIGINT', function () {
  //   console.log('\nGracefully shutting down from SIGINT (Ctrl+C)');
  //   disconnect(vacbot);
  // });
  httpServer.listen(port, () => console.log(`listening on *:${port}`));
});

const logEvent = (direction: eventDirection, name: string, payload: any) => {
  let directionLabel = `\x1b[42m\x1b[1m\x1b[37m[${direction}]\x1b[0m\x1b[0m\x1b[0m`;
  if (direction === 'send') {
    directionLabel = `\x1b[46m\x1b[1m\x1b[37m[${direction}]\x1b[0m\x1b[0m\x1b[0m`;
  }
  console.log(`${directionLabel} ${name} - with: `, payload);
};

function disconnect(vacbot: VacBot_950type | VacBot_non950type) {
  try {
    vacbot.disconnect();
  } catch (e: any) {
    console.log('Failure in disconnecting: ', e.message);
  }
  console.log('Exiting...');
  process.exit();
}

type eventDirection = 'send' | 'receive';
