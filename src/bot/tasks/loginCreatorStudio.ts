import { launch, Page } from 'puppeteer-core';
import { logger } from '../../logger';
import { InstagramCredentials } from '../../types';
import { loginInstagramAccount } from './loginInstagramAccount';
import { URLS, LAUNCH_OPTIONS } from './browser.config';

export async function loginCreatorStudio(
  credentials: InstagramCredentials
): Promise<Page | undefined> {
  logger.info('Logging into creator studio', {
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

  const browser = await launch(LAUNCH_OPTIONS);
  const page = await browser.newPage();

  try {
    await page.goto(URLS.CREATOR_STUDIO, {
      waitUntil: 'networkidle0',
      timeout: 0,
    });
  } catch (err) {
    logger.info('Retrying to load instagram');
    await page.goto(URLS.CREATOR_STUDIO, {
      waitUntil: 'networkidle0',
      timeout: 0,
    });
  }

  logger.info(page.url());

  let acceptCookiesButton = (
    await page.$$("[data-cookiebanner='accept_button']")
  )[0];

  if (acceptCookiesButton) {
    await acceptCookiesButton.click();
    await acceptCookiesButton.click();
  }

  await page.waitForTimeout(1000);

  await (
    await page.$$("[id='media_manager_chrome_bar_instagram_icon']")
  )[0].click();

  const igLogin = (await page.$$("div[role='none']"))[0];
  logger.info(igLogin);
  await igLogin.click();

  const newPagePromise = new Promise((x) =>
    browser.once('targetcreated', (target) => x(target.page()))
  );

  const popup = (await newPagePromise) as Page;
  await loginInstagramAccount(credentials, popup);

  await page.waitForNavigation({
    waitUntil: 'networkidle0',
    timeout: 0,
  });

  return page;
}
