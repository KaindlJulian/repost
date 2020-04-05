import assert from 'assert';
import dotenv from 'dotenv';
import { TIMEOUT } from './config.test';
import { InstagramCredentials } from '../../../src/types';
import { exploreAndLike } from '../../../src/bot/tasks/exploreAndLike';
import { Randomizer } from '../../../src/bot/Randomizer';

dotenv.config();

describe('createInstagramPost', function () {
  this.timeout(60 * TIMEOUT);

  it('should like some posts', async () => {
    const creds: InstagramCredentials = {
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    };

    const randomizer = Randomizer.getInstance().setSeed(creds.username);

    const success = await exploreAndLike(creds, randomizer);

    assert.strictEqual(success, true);
  });
});
