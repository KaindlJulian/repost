import assert from 'assert';
import dotenv from 'dotenv';
import { launch } from 'puppeteer';
import { loginCreatorStudio } from '../../../src/bot/tasks';
import { LAUNCH_OPTIONS } from '../../../src/bot/tasks/task.config';
import { TIMEOUT } from './config.test';

dotenv.config();

describe('loginCreatorStudio', function () {
  this.timeout(TIMEOUT);

  it('should resolve to false with login form invalid credentials', async () => {
    const browser = await launch();
    const page = await browser.newPage();

    const success = await loginCreatorStudio(page, browser, {
      username: '',
      password: '',
    });

    assert.strictEqual(success, undefined);
  });

  it('should login sucessfully with valid credentials', async () => {
    const browser = await launch(LAUNCH_OPTIONS);
    const page = await browser.newPage();

    const success = await loginCreatorStudio(page, browser, {
      username: process.env.IG_TEST_USER!,
      password: process.env.IG_TEST_PASS!,
    });

    assert.notStrictEqual(success, undefined);
  });
});
