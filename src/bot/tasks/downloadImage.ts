import path from 'path';
import { promises as fs } from 'fs';
import { launch } from 'puppeteer';
import { logger } from '../../logger';
import { Content, PostableContent } from '../../types';

export const FILE_DIR = '../../../temp/downloads';

/**
 * Tries to download the image from a given url.
 * @returns {Promise<PostableContent>} Resolves to a PostableContent object with `filePath` being
 * an absolute path to the downloaded image.
 */
export async function downloadImage(
  content: Content
): Promise<PostableContent | undefined> {
  logger.info('Downloading image', content);

  const browser = await launch({ headless: true });
  const page = await browser.newPage();

  const source = await page.goto(content.imageUrl);

  if (!source) {
    logger.warn('No image found on', content.imageUrl);
    return undefined;
  }

  const file = path.resolve(
    __dirname,
    FILE_DIR,
    content.imageUrl.split('/').pop()!
  );

  await fs.writeFile(file, await source.buffer());

  return { ...content, filePath: file };
}
