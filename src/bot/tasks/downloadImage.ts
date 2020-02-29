import fs from 'fs';
import path from 'path';
import { launch } from 'puppeteer';
import { logger } from '../../logger';
import { PostContent } from '../../types';

export const FILE_DIR = './downloads/';

export async function downloadImage(
  content: PostContent
): Promise<string | undefined> {
  logger.info('Downloading image', content);

  const browser = await launch({ headless: true });
  const page = await browser.newPage();

  const source = await page.goto(content.imageUrl);

  if (!source) {
    logger.warn('No image found on', content.imageUrl);
    return undefined;
  }

  const file = path.join(FILE_DIR, content.imageUrl);

  // save image to FILE_DIR with the imageUrl as filename
  fs.writeFile(file, source.buffer(), err => {
    logger.error('Could not save file', err);
  });

  return file;
}
