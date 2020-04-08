import { launch, Page } from 'puppeteer';
import { InstagramCredentials, InstagramChat } from '../../types';
import { URLS, GALAXY_S5, LAUNCH_OPTIONS } from './task.config';
import { loginInstagramAccount } from './loginInstagramAccount';
import { logger } from '../../logger';

export async function collectChats(credentials: InstagramCredentials) {
  const browser = await launch(LAUNCH_OPTIONS);
  let page: Page | undefined = await browser.newPage();

  logger.info('Collecting chats for', credentials.username);

  await page.emulate(GALAXY_S5);
  await page.browserContext().overridePermissions(URLS.INSTAGRAM, []);

  page = await loginInstagramAccount(page, credentials);

  if (!page) {
    logger.error('Login failed');
    return [];
  }

  await page.goto(URLS.INSTAGRAM_CHATS, { waitUntil: 'networkidle2' });

  await page.waitFor(2000);

  const nextButton = (
    await page.$x("//button[contains(text(), 'Not Now')]")
  )[0];

  if (nextButton) {
    await nextButton.click();
  }

  const avatars = await page.$$('img[alt*="profile"]');

  return await Promise.all(
    avatars.map(async (handle) => {
      return await handle.evaluate((e) => {
        const avatarUrl = e.getAttribute('src')!;
        const data = e.parentElement?.parentElement?.parentElement?.parentElement?.innerText.split(
          '\n'
        )!;
        return {
          avatarUrl,
          username: data[0],
          lastMessage: data[1],
          lastSeen: data[3],
        } as InstagramChat;
      });
    })
  );
}
