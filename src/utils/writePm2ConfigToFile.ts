import { promises as fs } from 'fs';
import path from 'path';

/**
 * Writes pm2 config object to a new bot config file in `/bots`
 */
export async function writePm2ConfigToFile(config: any) {
  const configFile = path.resolve(
    __dirname,
    '../../bots',
    `${config.name}.config.js`
  );
  const barrelFile = path.resolve(__dirname, '../../bots', 'index.js');

  await fs.writeFile(configFile, buildFile(config));
  await fs.appendFile(
    barrelFile,
    `\n__export(require("./${config.name}.config"));`
  );
}

function buildFile(config: any) {
  return [
    `"use strict;"`,
    `Object.defineProperty(exports, "__esModule", { value: true });`,
    `exports.${config.name} = JSON.parse(${JSON.stringify(config)});`,
  ].join('\n');
}
