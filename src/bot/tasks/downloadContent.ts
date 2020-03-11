import path from 'path';
import { promises as fs } from 'fs';
import { launch, Page } from 'puppeteer';
import { logger } from '../../logger';
import { Content, PostableContent, ContentType } from '../../types';
import { FILE_DOWNLOAD_DIR, LAUNCH_OPTIONS } from './task.config';

/**
 * Tries to download a file from a given url.
 * @returns {Promise<PostableContent>} Resolves to a PostableContent object with `filePath` being
 * an absolute path to the downloaded file.
 */
export async function downloadContent(
  content: Content
): Promise<PostableContent | undefined> {
  if (content.url.length === 0) {
    return undefined;
  }

  logger.info('Downloading file', content);

  const browser = await launch(LAUNCH_OPTIONS);
  const page = await browser.newPage();

  switch (content.type) {
    case ContentType.Image:
      return handleFile(page, content);
    case ContentType.Gif:
      return handleFile(page, content);
    case ContentType.Video:
      return handleVideo(page, content);
  }
}

async function handleFile(
  page: Page,
  content: Content
): Promise<PostableContent | undefined> {
  const source = await page.goto(content.url);

  if (!source) {
    logger.warn('No file found on', content.url);
    return undefined;
  }

  const file = path.resolve(
    __dirname,
    FILE_DOWNLOAD_DIR,
    content.url.split('/').pop()!
  );

  await fs.writeFile(file, await source.buffer());

  return { ...content, filePath: file };
}

async function handleVideo(
  page: Page,
  content: Content
): Promise<PostableContent | undefined> {
  // TODO: Convert mp4 to gif
  return undefined;
}
