import dotenv from 'dotenv';
import assert from 'assert';
import { loginInstagramAccount } from '../../../src/bot/tasks';
import { launch } from 'puppeteer';

dotenv.config();

describe('createInstagramPost', function() {
  this.timeout(20000);

  it('should resolve to false with login form invalid credentials', async () => {
    const browser = await launch({ headless: true });
    const page = await browser.newPage();

    const success = await loginInstagramAccount(page, {
      username: '',
      password: '',
    });

    assert.strictEqual(success, false);
  });

  it('should resolve to false with authentication invalid credentials', async () => {
    const browser = await launch({ headless: true });
    const page = await browser.newPage();

    const success = await loginInstagramAccount(page, {
      username: 'abc',
      password: '123456',
    });

    assert.strictEqual(success, false);
  });

  it('should login sucessfully with valid credentials', async () => {
    const browser = await launch({ headless: true });
    const page = await browser.newPage();

    const success = await loginInstagramAccount(page, {
      username: process.env.IG_TEST_USER,
      password: process.env.IG_TEST_PASS,
    });

    assert.strictEqual(success, true);
  });
});
