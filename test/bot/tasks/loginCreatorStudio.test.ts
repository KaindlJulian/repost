import assert from 'assert';
import dotenv from 'dotenv';
import { loginCreatorStudio } from '../../../src/bot/tasks';
import { TIMEOUT } from './config.test';

dotenv.config();

describe('loginCreatorStudio', function () {
  this.timeout(TIMEOUT);

  it('should resolve to false with login form invalid credentials', async () => {
    const success = await loginCreatorStudio({
      username: '',
      password: '',
    });

    assert.strictEqual(success, undefined);
  });

  it('should login sucessfully with valid credentials', async () => {
    const success = await loginCreatorStudio({
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    });

    assert.notStrictEqual(success, undefined);

    if (success) {
      success.browser().close();
    }
  });
});
