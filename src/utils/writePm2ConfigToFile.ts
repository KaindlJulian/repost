import { promises as fs } from 'fs';
import path from 'path';

/**
 * Writes pm2 config object to a new bot config file in `/bots`
 */
export function writePm2ConfigToFile(config: any) {
  const file = path.resolve(
    __dirname,
    '../../bots',
    `${config.name}.config.ts`
  );
  fs.writeFile(file, config);
}
