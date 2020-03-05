import assert from 'assert';
import dotenv from 'dotenv';
import { createInstagramPost, downloadImage } from '../../../src/bot/tasks';
import { InstagramCredentials } from '../../../src/types';

dotenv.config();

describe('createInstagramPost', function() {
  this.timeout(2000000);

  it('should create a new post', async () => {
    const creds: InstagramCredentials = {
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    };

    const postableContent = await downloadImage({
      caption: 'Look at my cute cat',
      imageUrl: 'https://i.redd.it/g2p43e3fqgk41.jpg',
    });

    const tags = ['cat', 'cute'];

    const success = await createInstagramPost(creds, postableContent!, tags);

    assert.strictEqual(success, true);
  });
});
