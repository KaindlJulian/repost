import path from 'path';
import { promises as fs } from 'fs';
import { launch } from 'puppeteer';
import { logger } from '../../logger';
import { Content, PostableContent } from '../../types';
import { FILE_DOWNLOAD_DIR } from './task.config';

/**
 * Tries to download a file from a given url.
 * @returns {Promise<PostableContent>} Resolves to a PostableContent object with `filePath` being
 * an absolute path to the downloaded file.
 */
export async function downloadContent(
  content: Content
): Promise<PostableContent | undefined> {
  logger.info('Downloading file', content);

  const browser = await launch({ headless: true });
  const page = await browser.newPage();

  const source = await page.goto(content.imageUrl);

  if (!source) {
    logger.warn('No file found on', content.imageUrl);
    return undefined;
  }

  const file = path.resolve(
    __dirname,
    FILE_DOWNLOAD_DIR,
    content.imageUrl.split('/').pop()!
  );

  await fs.writeFile(file, await source.buffer());

  return { ...content, filePath: file };
}
