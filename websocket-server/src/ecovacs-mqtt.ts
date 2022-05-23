import { countries, EcoVacsAPI } from 'ecovacs-deebot';
import VacBot_950type from 'ecovacs-deebot/types/library/950type/vacBot';
import VacBot_non950type from 'ecovacs-deebot/types/library/non950type/vacBot';
import { machineIdSync } from 'node-machine-id';

export const connectToDeebot = (): Promise<
  VacBot_950type | VacBot_non950type
> => {
  const account_id = process.env.ACCOUNT_ID;
  const password = process.env.PASSWORD;
  const countryCode = process.env.COUNTRYCODE || 'cn';

  const password_hash = password && EcoVacsAPI.md5(password);
  const device_id = EcoVacsAPI.getDeviceId(machineIdSync());
  const continent = countries[countryCode].continent.toLowerCase();

  const api = new EcoVacsAPI(device_id, countryCode, continent);

  return new Promise(async (resolve, reject) => {
    if (!account_id || !password_hash) {
      return reject('account_id or password_hash is missing');
    }
    api.connect(account_id, password_hash).then(async () =>
      api.devices().then((devicesList: any) => {
        const vacuum = devicesList[0];
        const vacbot = api.getVacBot(
          api.uid,
          EcoVacsAPI.REALM,
          api.resource,
          api.user_access_token,
          vacuum,
          continent
        );

        logVacbotData(vacbot, EcoVacsAPI);
        // console.log(vacbot.ecovacs.bot.vacuum);

        vacbot.connect();
        vacbot.on('ready', (event: any) => {
          console.log('vacbot ready', event);
          return resolve(vacbot);
        });
      })
    );
  });
};

const logVacbotData = (
  vacbot: VacBot_950type | VacBot_non950type,
  ecovacsAPI: typeof EcoVacsAPI
): void => {
  console.log('[Logs] name: ' + vacbot.getDeviceProperty('name'));
  console.log('[Logs] isKnownDevice: ' + vacbot.isKnownDevice());
  console.log('[Logs] isSupportedDevice: ' + vacbot.isSupportedDevice());
  console.log('[Logs] is950type: ' + vacbot.is950type());
  console.log('[Logs] isNot950type: ' + vacbot.isNot950type());
  console.log('[Logs] protocol: ' + vacbot.getProtocol());
  console.log('[Logs] hasMainBrush: ' + vacbot.hasMainBrush());
  console.log('[Logs] hasEdgeCleaningMode: ' + vacbot.hasEdgeCleaningMode());
  console.log('[Logs] hasSpotCleaningMode: ' + vacbot.hasSpotCleaningMode());
  console.log(
    '[Logs] hasMappingCapabilities: ' + vacbot.hasMappingCapabilities()
  );
  console.log(
    '[Logs] hasSpotAreaCleaningMode: ' + vacbot.hasSpotAreaCleaningMode()
  );
  console.log(
    '[Logs] hasCustomAreaCleaningMode: ' + vacbot.hasCustomAreaCleaningMode()
  );
  console.log('[Logs] hasMoppingSystem: ' + vacbot.hasMoppingSystem());
  console.log('[Logs] hasVoiceReports: ' + vacbot.hasVoiceReports());
  console.log('[Logs] hasAutoEmptyStation: ' + vacbot.hasAutoEmptyStation());
  console.log(
    '[Logs] isCanvasModuleAvailable: ' + ecovacsAPI.isCanvasModuleAvailable()
  );
};
