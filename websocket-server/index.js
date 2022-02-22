import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectToDeebot } from './ecovacs-mqtt.js';

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

    vacbot.on('ChargeState', (state) => {
      logEvent('send', 'ChargeState', state);
      socket.emit('ChargeState', state);
    });

    vacbot.on('BatteryInfo', (state) => {
      logEvent('send', 'BatteryInfo', state);

      socket.emit('BatteryInfo', state);
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
  });

  httpServer.listen(port, () => console.log(`listening on *:${port}`));
});

const logEvent = (direction, name, payload) => {
  console.log(`[${direction}] ${name} - with: ${payload}`);
};
