import assert from 'assert';
import dotenv from 'dotenv';
import { loginInstagramAccount } from '../../../src/bot/tasks';
import { TIMEOUT } from './config.test';

dotenv.config();

describe('loginInstagramAccount', function () {
  this.timeout(TIMEOUT);

  it('should resolve to false with login form invalid credentials', async () => {
    const success = await loginInstagramAccount({
      username: '',
      password: '',
    });

    assert.strictEqual(success, undefined);
  });

  it('should resolve to false with authentication invalid credentials', async () => {
    const success = await loginInstagramAccount({
      username: 'abc',
      password: '123456',
    });

    assert.strictEqual(success, undefined);
  });

  it('should login sucessfully with valid credentials', async () => {
    const success = await loginInstagramAccount({
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    });

    assert.notStrictEqual(success, undefined);
  });
});
