import { eventDirection } from '../models/logger.model';

export const logEvent = (direction: eventDirection, name: string, payload: any) => {
  let directionLabel = `\x1b[42m\x1b[1m\x1b[37m[${direction}]\x1b[0m\x1b[0m\x1b[0m`;
  if (direction === 'send') {
    directionLabel = `\x1b[46m\x1b[1m\x1b[37m[${direction}]\x1b[0m\x1b[0m\x1b[0m`;
  }
  console.log(`${directionLabel} ${name} - with: `, payload);
};