import { sendMessageToProcess } from './sendMessageToProcess';
import { MessageType, CreatePostMessage, ContentType } from '../../types';

/**
 * Add subreddits to a given bot
 */
export function createPost(name: string, caption?: string, url?: string) {
  const urlFileExt = caption
    ?.split('.')
    [caption?.split('.').length - 1].toLowerCase();

  let type: ContentType;
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
      return;
  }

  const message: CreatePostMessage = {
    type: MessageType.CreatePostMessage,
    value: caption && url ? { caption, url, type } : undefined,
  };
  sendMessageToProcess(name, message);
}
