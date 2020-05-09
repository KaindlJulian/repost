import { Page } from 'puppeteer';
import { InstagramCredentials } from '../../types';
import { logger } from '../../logger';
import { URLS } from './task.config';

/**
 * Tries to login to instagram with given credentials
 * @returns {Promise<boolean>} resolves to `true` if logged in succesfully
 */
export async function loginInstagramAccount(
  page: Page,
  credentials: InstagramCredentials
): Promise<Page | undefined> {
  logger.info('Logging into instagram account', {
    username: credentials.username,
  });

  if (
    !credentials.username ||
    !credentials.password ||
    credentials.password.length < 6
  ) {
    logger.warn(
      'Tried to login with invalid credentials',
      credentials.username
    );
    return;
  }

  await page.goto(URLS.INSTAGRAM_LOGIN, { waitUntil: 'networkidle2' });

  if (await isValidSession(page)) {
    return page;
  }

  await page.waitForSelector('[name=username]');

  // type in credentials and click submit
  await page.type('[name=username]', credentials.username, { delay: 50 });
  await page.type('[name=password', credentials.password, { delay: 50 });
  await page.waitFor(2000);
  await page.click('[type=submit');

  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  await page.screenshot({
    type: 'png',
    path: `${process.env.HOME}/.pm2/logs/memes.png`,
  });

  // check for login error
  const error = await page.$('#slfErrorAlert');
  if (error) {
    logger.warn('Instagram login failed with', credentials);
    return;
  }

  logger.info('Successfully logged in', { username: credentials.username });

  return page;
}

/**
 * Check if the chromium user dir has a session cookie
 */
async function isValidSession(page: Page) {
  const cookies = await page.cookies();
  const sessionIdCookies = cookies.filter((c) => c.name === 'sessionid');
  logger.info('Instagram Session', { ...sessionIdCookies[0] });
  return sessionIdCookies.length === 1 && sessionIdCookies[0].value !== '';
}
