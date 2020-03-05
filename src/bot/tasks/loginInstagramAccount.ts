import { Page } from 'puppeteer';
import { InstagramCredentials } from '../../types';
import { logger } from '../../logger';
import { INSTAGRAM_LOGIN_PAGE } from './task.config';

/**
 * Tries to login to instagram with given credentials
 * @returns {Promise<boolean>} resolves to `true` if logged in succesfully
 */
export async function loginInstagramAccount(
  page: Page,
  credentials: InstagramCredentials
): Promise<boolean> {
  if (
    !credentials.username ||
    !credentials.password ||
    credentials.password.length < 6
  ) {
    return false;
  }

  await page.goto(INSTAGRAM_LOGIN_PAGE);

  await page.waitForSelector('[name=username]');

  // type in credentials and click submit
  await page.type('[name=username]', credentials.username);
  await page.type('[name=password', credentials.password);
  await page.click('[type=submit');

  await page.waitFor(3000);

  // check for login error
  const error = await page.$('#slfErrorAlert');
  if (error) {
    logger.warn('Instagram login failed with', credentials);
    return false;
  }
  return true;
}
