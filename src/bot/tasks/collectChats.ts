import { launch, Page } from 'puppeteer';
import { InstagramCredentials, InstagramChat } from '../../types';
import { URLS, GALAXY_S5, LAUNCH_OPTIONS } from './task.config';
import { loginInstagramAccount } from './loginInstagramAccount';
import { logger } from '../../logger';

/**
 * Collects data from the bots instagram inbox
 */
export async function collectChats(
  credentials: InstagramCredentials
): Promise<InstagramChat[]> {
  const browser = await launch(LAUNCH_OPTIONS);
  let page: Page | undefined = await browser.newPage();

  await page.emulate(GALAXY_S5);
  await page.browserContext().overridePermissions(URLS.INSTAGRAM, []);

  page = await loginInstagramAccount(page, credentials);

  if (!page) {
    logger.error('Login failed');
    return [];
  }

  await page.goto(URLS.INSTAGRAM_CHATS, { waitUntil: 'networkidle2' });

  logger.info('Collecting chats', { account: credentials.username });

  // close popup
  const nextButton = (
    await page.$x("//button[contains(text(), 'Not Now')]")
  )[0];
  if (nextButton) {
    await nextButton.click();
  }

  await page.waitFor(2000);

  await page.waitForSelector('img[alt*="profile"]');

  // get element handles for all avatars
  const avatars = await page.$$('img[alt*="profile"]');
  logger.info('Found avatars', { amount: avatars.length });

  // iterate handles and evaluate to an InstagramChat object
  const result = await Promise.all(
    avatars.map(async (handle) => {
      return await handle.evaluate((e) => {
        const avatarUrl = e.getAttribute('src')!;
        const data = e.parentElement?.parentElement?.parentElement?.parentElement?.innerText.split(
          '\n'
        )!;
        const datetime = e.parentElement?.parentElement?.parentElement?.parentElement
          ?.querySelector('time')
          ?.getAttribute('datetime');

        return {
          avatarUrl,
          username: data[0],
          lastMessage: data[1],
          dateFormatted: data[3],
          date: datetime,
        } as InstagramChat;
      });
    })
  );

  await browser.close();

  return result;
}
