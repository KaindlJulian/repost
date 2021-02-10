import assert from 'assert';
import dotenv from 'dotenv';
import { downloadContent, createInstagramPost } from '../../../src/bot/tasks';
import { InstagramCredentials, ContentType } from '../../../src/types';
import { TIMEOUT } from './config.test';

dotenv.config();

describe('createInstagramPost', function () {
  this.timeout(TIMEOUT);

  it('should create a new image post', async () => {
    const creds: InstagramCredentials = {
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    };

    const postableContent = await downloadContent({
      caption: 'Look at my cute cat',
      url: 'https://i.redd.it/g2p43e3fqgk41.jpg',
      type: ContentType.Image,
    });

    const tags = ['cat', 'cute'];

    const success = await createInstagramPost(creds, postableContent!, tags);

    assert.strictEqual(success, true);
  });
});
