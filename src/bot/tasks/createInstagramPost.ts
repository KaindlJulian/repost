import { launch } from 'puppeteer';
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
  const page = await browser.newPage();

  await page.emulate(GALAXY_S5);
  await page
    .browserContext()
    .overridePermissions(URLS.INSTAGRAM, ['geolocation']);

  const success = await loginInstagramAccount(page, credentials);
  if (!success) {
    return false;
  }

  await page.goto(`${URLS.INSTAGRAM}/${credentials.username}`);
  await page.waitForSelector('div[data-testid="new-post-button"]');

  // upload the image
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('div[data-testid="new-post-button"]'),
  ]);
  await fileChooser.accept([content.filePath]);

  const nextButton = (await page.$x("//button[contains(text(), 'Next')]"))[0];
  page.waitFor(1000);
  await nextButton.click();

  // enter the post description with tags
  const input = `${content.caption}\n\n${tags.map(t => `#${t}`).join(' ')}`;
  await page.waitForSelector('textarea');
  await page.type('textarea', input);

  const shareButton = (await page.$x("//button[contains(text(), 'Share')]"))[0];

  if (!shareButton) {
    return false;
  }

  // only actually post when running prod
  if (process.env.NODE_ENV === 'production') {
    await shareButton.click();
  }

  return true;
}
