import { launch, Page } from 'puppeteer-core';
import { InstagramCredentials } from '../../types';
import { logger } from '../../logger';
import { URLS, LAUNCH_OPTIONS } from './task.config';

/**
 * Tries to login to instagram with given credentials
 * @param Page Optionally provide the ig login page, if undefined the task creates a new page
 * @returns {Promise<Page | undefined>} resolves to ig page or undefined. (returns undefined if the page closes for oauth)
 */
export async function loginInstagramAccount(
  credentials: InstagramCredentials,
  page?: Page
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

  let isOauth = false;
  if (page) {
    if (!page.url().includes(URLS.INSTAGRAM_LOGIN)) {
      logger.error('Invoked "loginInstagramAccount" on wrong URL', page.url());
      return undefined;
    }
    if (page.url().includes('redirect_uri')) {
      isOauth = true;
    }
  } else {
    const browser = await launch(LAUNCH_OPTIONS);
    page = await browser.newPage();
    page.goto(URLS.INSTAGRAM_LOGIN);
  }

  await page.waitForXPath('//button[@tabindex = 0]');
  const cookieAcceptButton = (await page.$x('//button[@tabindex = 0]'))[0];

  if (cookieAcceptButton) {
    cookieAcceptButton.click();
  }

  await page.waitForTimeout(1000);

  // type in credentials and click submit
  await page.type('[name=username]', credentials.username, { delay: 50 });
  await page.type('[name=password', credentials.password, { delay: 50 });
  await page.waitForTimeout(1000);
  await page.click('[type=submit');

  // check for oauth (the page will auto close after submit)
  if (isOauth) {
    await page.waitForNavigation();
    page.$$eval('button[type=button]', (el) => {
      console.log(el);
      (el[1] as HTMLButtonElement).click();
    });
    return undefined;
  }

  // check for login error
  try {
    const error = await page.waitForSelector('#slfErrorAlert', {
      timeout: 3000,
    });
    if (error && error.asElement()) {
      logger.warn('Instagram login failed with', credentials);
      return undefined;
    }
  } catch (err) {
    logger.info('Successfully logged in', { username: credentials.username });
    console.log('successfull login');
    return page;
  }
  return page;
}

/**
 * Check if the chromium user dir has a session cookie
 */
async function isValidSession(page: Page) {
  const cookies = await page.cookies();
  const sessionIdCookies = cookies.filter((c) => c.name === 'sessionid');
  if (sessionIdCookies.length === 1 && sessionIdCookies[0].value !== '') {
    logger.info('Instagram Session', { ...sessionIdCookies[0] });
    return true;
  }
  return false;
}
