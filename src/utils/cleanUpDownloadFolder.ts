import { existsSync, fstat, readdir, unlink } from 'fs';
import path from 'path';
import { FILE_DOWNLOAD_DIR } from '../bot/tasks/browser.config';

export async function cleanUpDownloadFolder() {
  const directory = path.resolve(__dirname, '../../downloads');
  if (existsSync(directory)) {
    readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });
  }
}
