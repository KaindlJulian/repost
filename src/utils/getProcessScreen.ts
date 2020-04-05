import { promises as fs } from 'fs';
import path from 'path';

export async function getProcessScreen(name: string) {
  return await fs.readFile(
    path.join(process.env.HOME!, '.pm2', 'logs', `${name}.png`)
  );
}
