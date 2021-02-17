import { Page } from 'puppeteer';
import { logger } from '../../logger';
import { PostableContent, PostableContentType } from '../../types';
import { getVideoLength } from '../../utils/getVideoLength';

/**
 * Creates a new instagram post using the creator studio
 * @param page A logged in creator studio page
 * @param content The content to post, can be any content type
 */
export async function createInstagramPost(
  page: Page,
  content: PostableContent,
  tags: string[]
) {
  const button = await page.waitForSelector('div[role="button"]');
  await button.click();

  // check for ig TV
  if (content.type === PostableContentType.Video) {
    const duration = await getVideoLength(content.filePath);
    if (duration >= 60) {
      await createInstagramTV(page, content);
      return;
    }
  }

  const menu = await page.waitForSelector('[role="menu"]');
  await menu.evaluate((e) => {
    (e.firstChild?.firstChild?.firstChild as HTMLElement).click();
  });

  // enter the post description with tags (first tag is subreddit name)
  const sourceTag = content.source ? `#${content.source} ` : '';
  const input = `${content.caption}\n\n${sourceTag}${tags
    .map((t) => `#${t}`)
    .join(' ')}`;

  const textfield = await page.waitForSelector('[style*="user-select"]');
  await textfield.type(input);

  // enter location
  const locationInput = await page.waitForSelector('input[autocomplete="off"]');
  await locationInput.type(process.env.TIME_ZONE || 'Europe/Vienna');
  await locationInput.press('Enter');

  // upload content
  const dropdown = await page.waitForSelector(
    '[aria-haspopup="true"][aria-controls]'
  );
  await dropdown.click();
  const upload = await page.waitForSelector('input[accept="video/*, image/*"]');
  await upload.uploadFile(content.filePath);

  await page.waitForXPath('//div[contains(text(), "100%")]', {
    timeout: 60_000,
  });

  // publish
  const publishButton = await page.waitForSelector(
    '[style*="background-clip"]'
  );

  if (process.env.NODE_ENV === 'production') {
    await publishButton.click();
    logger.info('Created new Post!', { content });
  }

  await page.browser().close();
}

/**
 * @todo
 */
async function createInstagramTV(page: Page, content: PostableContent) {
  await page.browser().close();
}
