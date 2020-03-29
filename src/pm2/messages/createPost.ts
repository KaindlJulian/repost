import { sendMessageToProcess } from './sendMessageToProcess';
import { MessageType, CreatePostMessage, ContentType } from '../../types';
import { logger } from '../../logger';

/**
 * Add subreddits to a given bot
 */
export function createPost(name: string, caption?: string, url?: string) {
  logger.info(url || 'undefind');

  const urlFileExt = caption
    ?.split('.')
    [caption?.split('.').length - 1].toLowerCase();

  let type;
  switch (urlFileExt) {
    case 'png' || 'jpg' || 'jpeg':
      type = ContentType.Image;
      break;
    case 'mp4':
      type = ContentType.Video;
      break;
    case 'gif':
      type = ContentType.Gif;
      break;
    default:
      type = null;
  }

  const message: CreatePostMessage = {
    type: MessageType.CreatePostMessage,
    value: caption && url && type ? { caption, url, type } : undefined,
  };
  sendMessageToProcess(name, message);
}
