import path from 'path';
import { promises as fs } from 'fs';
import { launch, Page } from 'puppeteer';
import { logger } from '../../logger';
import { Content, PostableContent, ContentType } from '../../types';
import { FILE_DOWNLOAD_DIR, LAUNCH_OPTIONS, URLS } from './task.config';

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

  switch (content.type) {
    case ContentType.Image:
      return handleFile(page, content);
    case ContentType.Gif:
      return handleFile(page, content);
    case ContentType.Video:
      const convertedContent = await convertVideo(page, content);
      return handleFile(page, convertedContent);
  }
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

  logger.info('Downloading file', content);

  await fs.writeFile(file, await source.buffer());

  return { ...content, filePath: file };
}

/**
 * Converts video content to gif content
 */
async function convertVideo(page: Page, content: Content): Promise<Content> {
  await page.goto(URLS.VIDEO_TO_GIF);

  // enter mp4 url and submit
  await page.type('[name="new-image-url"]', content.url);
  await page.click('[name="upload"]');

  // click convert
  await page.waitForSelector('[name="video-to-gif"]');
  await page.click('name="video-to-gif"');

  // get converted gif direct link
  const gifUrl = await (
    await page.waitForSelector('img[alt="[video-to-gif output image]"]')
  ).evaluate(element => {
    return `https:${element.getAttribute('src')}`;
  });

  const convertedContent: Content = {
    type: ContentType.Gif,
    url: gifUrl,
    caption: content.caption,
  };

  logger.info('Converted: ', content, convertedContent);

  return convertedContent;
}
