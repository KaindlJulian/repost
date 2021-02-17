import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import { promisify } from 'util';

const exec = promisify(require('child_process').exec);

/**
 * Resolves to video length in seconds
 * @param file Path to video file
 */
export async function getVideoLength(file: string): Promise<number> {
  const { stdout } = await exec(
    `${ffprobePath} -v error -show_format -show_streams ${file}`
  );

  const matched = stdout.match(/duration="?(\d*\.\d*)"?/);
  if (matched && matched[1]) {
    return parseFloat(matched[1]);
  }

  throw new Error('No duration found!');
}
