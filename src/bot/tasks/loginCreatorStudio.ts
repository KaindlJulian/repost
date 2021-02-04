import { Browser, Page } from 'puppeteer';
import { logger } from '../../logger';
import { InstagramCredentials } from '../../types';
import { NAV_TIMEOUT, URLS } from './task.config';

export async function loginCreatorStudio(
  page: Page,
  browser: Browser,
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
    await page.$x("//button[@data-cookiebanner='accept_button']")
  )[0];
  if (acceptCookiesButton) {
    await acceptCookiesButton.click();

    acceptCookiesButton = (
      await page.$x("//button[@data-cookiebanner='accept_button']")
    )[0];
    await acceptCookiesButton.click();
  }

  await page.waitForTimeout(1000);
  await (
    await page.$x("//*[@id='media_manager_chrome_bar_instagram_icon']")
  )[0].click();
  const igLogin = (await page.$x("//div[@role='none']"))[0];
  logger.info(igLogin);
  await igLogin.click();
  const newPagePromise = new Promise((x) =>
    browser.once('targetcreated', (target) => x(target.page()))
  );
  const popup = (await newPagePromise) as Page;
  logger.info(popup.url());
  await popup.waitForXPath("//button[@tabindex='0']");
  acceptCookiesButton = (await popup.$x("//button[@tabindex='0']"))[0];
  await acceptCookiesButton.click();
  await popup.type('[name=username]', credentials.username, { delay: 50 });
  await popup.type('[name=password', credentials.password, { delay: 50 });
  await popup.waitForTimeout(2000);
  await popup.click('[type=submit');
  await popup.waitForNavigation({
    waitUntil: 'networkidle2',
    timeout: NAV_TIMEOUT,
  });
  const error = await popup.$('#slfErrorAlert');
  if (error) {
    logger.warn('Instagram login failed with', credentials);
    return;
  }
  await popup.waitForXPath("//button[@type='button']");
  await (await popup.$x("//button[@type='button']"))[0].click();
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
    timeout: 0,
  });
  return page;
}
