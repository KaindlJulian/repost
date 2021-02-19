import assert from 'assert';
import dotenv from 'dotenv';
import {
  downloadContent,
  createInstagramPost,
  loginCreatorStudio,
} from '../../../src/bot/tasks';
import {
  InstagramCredentials,
  ContentType,
  PostableContentType,
} from '../../../src/types';
import { TIMEOUT } from './config.test';

dotenv.config();

describe('createInstagramPost', function () {
  this.timeout(TIMEOUT);

  /*it('should create a new image post', async () => {
    const creds: InstagramCredentials = {
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    };

    const page = await loginCreatorStudio(creds);

    const postableContent = await downloadContent({
      caption: 'Look at my cute cat',
      url: 'https://i.redd.it/g2p43e3fqgk41.jpg',
      type: ContentType.Image,
    });

    const tags = ['cat', 'cute'];

    const success = await createInstagramPost(page!, postableContent!, tags);

    assert.strictEqual(success, true);
  });*/

  it('should create a new video post (< 60s)', async () => {
    const creds: InstagramCredentials = {
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    };

    const page = await loginCreatorStudio(creds);

    const postableContent = await downloadContent({
      caption: 'Concert cat',
      url: 'https://i.imgur.com/zkuhOwf.mp4',
      type: ContentType.ImgurVideo,
    });

    const tags = ['concert', 'cat'];

    const success = await createInstagramPost(page!, postableContent!, tags);

    assert.strictEqual(success, true);
  });

  /*it('should create a new video post (TV, > 60s)', async () => {
    const creds: InstagramCredentials = {
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    };

    const page = await loginCreatorStudio(creds);

    const postableContent = await downloadContent({
      caption: 'He’s going to have a hell of a flight when he takes off',
      url: 'https://v.redd.it/y4gcoz1mxei61/HLSPlaylist.m3u8',
      type: ContentType.RedditVideo,
    });

    const tags = ['bird', 'spin'];

    const success = await createInstagramPost(page!, postableContent!, tags);

    assert.strictEqual(success, true);
  });*/
});
