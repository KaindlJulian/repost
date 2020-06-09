import { launch, Page } from 'puppeteer';
import { InstagramCredentials, PostableContent } from '../../types';
import { logger } from '../../logger';
import { loginInstagramAccount } from '.';
import { GALAXY_S5, URLS, LAUNCH_OPTIONS } from './task.config';

/**
 * Tries to create a new instagram post.
 * @returns {Promise<boolean>} resolves to `true` the post was created
 */
export async function createInstagramPost(
  credentials: InstagramCredentials,
  content: PostableContent,
  tags: string[]
): Promise<boolean> {
  logger.info('Creating post with', content);
  const browser = await launch(LAUNCH_OPTIONS);
  let page: Page | undefined = await browser.newPage();

  await page.emulate(GALAXY_S5);
  await page
    .browserContext()
    .overridePermissions(URLS.INSTAGRAM, ['geolocation']);

  page = await loginInstagramAccount(page, credentials);

  if (!page) {
    return false;
  }

  await page.waitFor(1000);
  await page.goto(`${URLS.INSTAGRAM}/${credentials.username}`, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });

  await page.waitForSelector('div[data-testid="new-post-button"]');

  // upload the image
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('div[data-testid="new-post-button"]'),
  ]);
  await fileChooser.accept([content.filePath]);
  await page.waitFor(2000);

  const fitImgButton = (await page.$x("//span[contains(text(), 'Expand')]"))[0];
  await fitImgButton.click();

  await page.waitFor(500);

  const nextButton = (await page.$x("//button[contains(text(), 'Next')]"))[0];
  await nextButton.click();

  await page.waitFor(500);

  // enter the post description with tags
  const input = `${content.caption}\n\n${tags.map((t) => `#${t}`).join(' ')}`;
  await page.waitForSelector('textarea');
  await page.type('textarea', input);

  const shareButton = (await page.$x("//button[contains(text(), 'Share')]"))[0];

  // only actually post when running prod
  if (process.env.NODE_ENV === 'production') {
    await shareButton.click();

    //SCREEN
    await page.screenshot({
      type: 'png',
      path: `${process.env.HOME}/.pm2/logs/memes.png`,
    });

    logger.info('Created new Post!', { content });
  }

  await page.waitFor(30_000);
  await browser.close();

  return true;
}
