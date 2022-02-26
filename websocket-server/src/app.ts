import dotenv from 'dotenv';
import VacBot_950type from 'ecovacs-deebot/types/library/950type/vacBot';
import VacBot_non950type from 'ecovacs-deebot/types/library/non950type/vacBot';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectToDeebot } from './ecovacs-mqtt.js';
import { eventsReceivedFromAPI } from './events-handling/event-received-from-api.js';
import { eventsReceivedFromFrontend } from './events-handling/event-received-from-frontend.js';

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

    eventsReceivedFromAPI(vacbot, socket);
    eventsReceivedFromFrontend(vacbot, socket);
  });

  // TODO
  // process.on('SIGINT', function () {
  //   console.log('\nGracefully shutting down from SIGINT (Ctrl+C)');
  //   disconnect(vacbot);
  // });
  httpServer.listen(port, () => console.log(`listening on *:${port}`));
});

function disconnect(vacbot: VacBot_950type | VacBot_non950type) {
  try {
    vacbot.disconnect();
  } catch (e: any) {
    console.log('Failure in disconnecting: ', e.message);
  }
  console.log('Exiting...');
  process.exit();
}
