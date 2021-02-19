import path from 'path';
import { createWriteStream, promises as fs } from 'fs';
import fetch from 'node-fetch';
import { logger } from '../../logger';
import {
  Content,
  PostableContent,
  ContentType,
  PostableContentType,
} from '../../types';
import { FILE_DOWNLOAD_DIR } from './task.config';

import util from 'util';
import { spawn } from 'child_process';
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

  let downloadedContent: PostableContent | undefined = undefined;

  logger.info('Trying to download content', { content });

  switch (content.type) {
    case ContentType.Image:
      downloadedContent = await handleFile(content);
      break;
    case ContentType.Gif:
      downloadedContent = await handleFile(content);
      break;
    case ContentType.ImgurVideo:
      downloadedContent = await handleFile(content);
      break;

    case ContentType.RedditVideo:
      downloadedContent = await handleRedditVideo(content);
      break;
  }

  console.log(downloadedContent);
  return downloadedContent;
};

/**
 * Downloads an image or gif file and returns postable content with filepath as
 * absolute path.
 */
async function handleFile(
  content: Content
): Promise<PostableContent | undefined> {
  await checkDownloadDir();

  const filePath = path.resolve(
    __dirname,
    FILE_DOWNLOAD_DIR,
    content.url.split('/').pop()!
  );

  logger.info('Downloading file', content);
  const response = await fetch(content.url);
  if (!response.ok) {
    logger.warn('No file found on', content.url);
    return undefined;
  }
  await streamPipeline(response.body, createWriteStream(filePath));

  const { type, ...postcontent } = content;

  return {
    filePath,
    type: PostableContentType.Video,
    ...postcontent,
  };
}

/**
 * Downloads a Video hosted on Reddit via FFMPEG and returns a PostableContent with filepath as absolute path
 */
async function handleRedditVideo(
  content: Content
): Promise<PostableContent | undefined> {
  await checkDownloadDir();

  const filePath = path.resolve(
    __dirname,
    FILE_DOWNLOAD_DIR,
    `${content.url.split('/')[3]}.mp4`
  );

  const child = spawn('ffmpeg', [
    '-protocol_whitelist',
    'file,http,https,tcp,tls',
    '-i',
    `${content.url}`,
    '-c',
    'copy',
    `${filePath}`,
  ]);

  child.stdout.on('data', (data) => {
    logger.info(`child stdout:\n${data}`);
  });

  child.stderr.on('data', (data) => {
    logger.error(`child stderr:\n${data}`);
  });

  const exitCode: any = await new Promise((resolve, reject) => {
    child.on('close', resolve);
  });

  if (exitCode) {
    return undefined;
  }

  const { type, ...postcontent } = content;

  return {
    filePath,
    type: PostableContentType.Video,
    ...postcontent,
  };
}

async function checkDownloadDir() {
  try {
    await fs.access(path.resolve(__dirname, FILE_DOWNLOAD_DIR));
  } catch (err) {
    logger.error('Couldnt access download directory', err);
    const newDir = path.resolve(__dirname, FILE_DOWNLOAD_DIR);
    logger.info('Creating download directory', newDir);
    await fs.mkdir(newDir);
  }
}
