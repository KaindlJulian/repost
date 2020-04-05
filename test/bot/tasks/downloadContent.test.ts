import assert from 'assert';
import dotenv from 'dotenv';
import { downloadContent } from '../../../src/bot/tasks';
import { ContentType } from '../../../src/types';
import { TIMEOUT } from './config.test';

dotenv.config();

describe('downloadContent', function () {
  this.timeout(TIMEOUT);

  it('should return undefined for content with empty url', async () => {
    const postableContent = await downloadContent({
      caption: 'Look at my cute cat',
      url: '',
      type: ContentType.Image,
    });
    assert.strictEqual(postableContent, undefined);
  });

  it('should return postable content for image type content', async () => {
    const postableContent = await downloadContent({
      caption: 'Look at my cute cat',
      url: 'https://i.redd.it/g2p43e3fqgk41.jpg',
      type: ContentType.Image,
    });
    assert.notDeepStrictEqual(postableContent, undefined);
  });

  it('should return postable content for gif type content', async () => {
    const postableContent = await downloadContent({
      caption: 'Claymation confused Travolta',
      url: 'https://i.redd.it/b0whwfgin0m41.gif',
      type: ContentType.Gif,
    });
    assert.notDeepStrictEqual(postableContent, undefined);
  });

  it('should return postable content for video type content', async () => {
    const postableContent = await downloadContent({
      caption: 'Once a good boy always a good boy',
      url: 'https://i.imgur.com/dFHcCl6.mp4',
      type: ContentType.Video,
    });
    assert.notDeepStrictEqual(postableContent, undefined);
  });
});
