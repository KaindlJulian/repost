import path from 'path';
import { promises as fs } from 'fs';
import { logger } from '../../logger';
import { Content, PostableContent, ContentType } from '../../types';
import {
  FILE_DOWNLOAD_DIR,
  LAUNCH_OPTIONS,
  URLS,
  NAV_TIMEOUT,
} from './task.config';
import { launch } from 'puppeteer';
import { Page } from 'puppeteer';

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

  const browser = await launch(LAUNCH_OPTIONS);
  const page = await browser.newPage();

  let downloadedContent: PostableContent | undefined = undefined;

  logger.info('Trying to download content', { content });

  switch (content.type) {
    case ContentType.Image:
      downloadedContent = await handleFile(page, content);
      break;
    case ContentType.Gif:
      await maxOutDevToolsResourceBuffer(page);
      downloadedContent = await handleFile(page, content);
      break;
    case ContentType.Video:
      const convertedContent = await convertVideo(page, content);
      await maxOutDevToolsResourceBuffer(page);
      downloadedContent = await handleFile(page, convertedContent);
      break;
  }

  await browser.close();
  return downloadedContent;
}

/**
 * Downloads an image or gif file and returns postable content with filepath as
 * absolute path.
 */
async function handleFile(
  page: Page,
  content: Content
): Promise<PostableContent | undefined> {
  if (content.type !== ContentType.Image && content.type !== ContentType.Gif) {
    return undefined;
  }

  const source = await page.goto(content.url, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });

  if (!source) {
    logger.warn('No file found on', content.url);
    return undefined;
  }

  try {
    await fs.access(path.resolve(__dirname, FILE_DOWNLOAD_DIR));
  } catch (err) {
    logger.error('Couldnt access download directory', err);
    const newDir = path.resolve(__dirname, FILE_DOWNLOAD_DIR);
    logger.info('Creating download directory', newDir);
    await fs.mkdir(newDir);
  }

  const file = path.resolve(
    __dirname,
    FILE_DOWNLOAD_DIR,
    content.url.split('/').pop()!
  );

  logger.info('Downloading file', content);

  await fs.writeFile(file, await source.buffer());

  return { ...content, filePath: file };
}

/**
 * Converts video content to gif content
 */
async function convertVideo(page: Page, content: Content): Promise<Content> {
  await page.goto(URLS.VIDEO_TO_GIF, {
    waitUntil: 'networkidle2',
    timeout: NAV_TIMEOUT,
  });

  logger.info('Converting video to gif', content);

  // enter mp4 url and submit
  await page.type('[name="new-image-url"]', content.url);
  await page.click('[name="upload"]');

  await page.waitFor(2000);

  // click convert
  await page.waitForSelector('[name="video-to-gif"]');
  await page.click('[name="video-to-gif"]');

  await page.waitFor(2000);

  // get converted gif direct link
  const gifUrl = await (
    await page.waitForSelector('img[alt="[video-to-gif output image]"]')
  )!.evaluate((element: any) => {
    return `https:${element.getAttribute('src')}`;
  });

  const convertedContent: Content = {
    type: ContentType.Gif,
    url: gifUrl,
    caption: content.caption,
    source: content.source,
  };

  logger.info('Converted: ', content, convertedContent);

  return convertedContent;
}

async function maxOutDevToolsResourceBuffer(page: Page) {
  // @ts-ignore
  await page._client.send('Network.enable', {
    maxResourceBufferSize: 1024 * 1204 * 100,
    maxTotalBufferSize: 1024 * 1204 * 200,
  });
}
