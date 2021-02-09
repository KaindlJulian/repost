import path from 'path';
import { createWriteStream, promises as fs } from 'fs';
import fetch from 'node-fetch';
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

import util from 'util';
const exec = util.promisify(require('child_process').exec);
const streamPipeline = util.promisify(require('stream').pipeline);

/**
 * Tries to download a file from a given url.
 * @returns {Promise<PostableContent>} Resolves to a PostableContent object with `filePath` being
 * an absolute path to the downloaded file.
 */
export const downloadContent = async (
  content: Content
): Promise<PostableContent | undefined> => {
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
    case ContentType.ImgurVideo:
      await maxOutDevToolsResourceBuffer(page);
      downloadedContent = await handleFile(page, content);
      break;

    case ContentType.RedditVideo:
      downloadedContent = await handleRedditVideo(content);
      break;
  }

  await browser.close();
  console.log(downloadedContent);
  return downloadedContent;
};

/**
 * Downloads an image or gif file and returns postable content with filepath as
 * absolute path.
 */
async function handleFile(
  page: Page,
  content: Content
): Promise<PostableContent | undefined> {
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
  if (content.type === ContentType.ImgurVideo) {
    const response = await fetch(content.url);
    if (!response.ok)
      throw new Error(`unexpected response ${response.statusText}`);
    await streamPipeline(response.body, createWriteStream(file));
  } else {
    await fs.writeFile(file, await source.buffer());
  }

  return { ...content, filePath: file };
}
/**
 * Downloads a Video hosted on Reddit via FFMPEG and returns a PostableContent with filepath as absolute path
 */
async function handleRedditVideo(
  content: Content
): Promise<PostableContent | undefined> {
  try {
    await fs.access(path.resolve(__dirname, FILE_DOWNLOAD_DIR));
  } catch (err) {
    logger.error('Couldnt access download directory', err);
    const newDir = path.resolve(__dirname, FILE_DOWNLOAD_DIR);
    logger.info('Creating download directory', newDir);
    await fs.mkdir(newDir);
  }

  const filePath = path.resolve(
    __dirname,
    FILE_DOWNLOAD_DIR,
    `${content.url.split('/')[3]}.mp4`
  );
  const ffmpegCommand = `ffmpeg -protocol_whitelist file,http,https,tcp,tls -i ${content.url} -c copy ${filePath}`;

  await exec(ffmpegCommand);

  return { ...content, filePath };
}

async function maxOutDevToolsResourceBuffer(page: Page) {
  // @ts-ignore
  await page._client.send('Network.enable', {
    maxResourceBufferSize: 1024 * 1204 * 100,
    maxTotalBufferSize: 1024 * 1204 * 200,
  });
}
