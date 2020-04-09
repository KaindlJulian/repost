import assert from 'assert';
import dotenv from 'dotenv';
import { collectChats } from '../../../src/bot/tasks';
import { InstagramCredentials } from '../../../src/types';
import { TIMEOUT } from './config.test';

dotenv.config();

describe('createInstagramPost', function () {
  this.timeout(TIMEOUT);

  it('should collect chats', async () => {
    const creds: InstagramCredentials = {
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    };

    const chats = await collectChats(creds);

    assert.notDeepStrictEqual(chats, []);
  });
});
