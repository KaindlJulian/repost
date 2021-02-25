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
  PostableContent,
} from '../../../src/types';
import { TIMEOUT } from './config.test';

dotenv.config();

describe('createInstagramPost', function () {
  this.timeout(TIMEOUT);

  it('should create a new image post', async () => {
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
  });

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

  it.only('should create a new video post (TV, > 60s)', async () => {
    const creds: InstagramCredentials = {
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    };

    const page = await loginCreatorStudio(creds);

    let postableContent: PostableContent = {
      caption: 'yerp',
      filePath: 'C:\\Users\\Julian\\Downloads\\tblmrsng.mp4',
      type: PostableContentType.Video,
      url: '',
      source: 'my dl folder',
    };

    const tags = ['bird', 'spin'];

    const success = await createInstagramPost(page!, postableContent!, tags);

    assert.strictEqual(success, true);
  });
});
