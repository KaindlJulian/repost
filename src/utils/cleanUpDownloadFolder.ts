import { readdir, unlink } from 'fs';
import path from 'path';
import { FILE_DOWNLOAD_DIR } from '../bot/tasks/task.config';

export async function cleanUpDownloadFolder() {
  const directory = path.resolve(__dirname, '../../downloads');
  console.log(directory);
  readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}
