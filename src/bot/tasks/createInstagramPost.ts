import { Page } from 'puppeteer-core';
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
): Promise<boolean> {
  const button = await page.waitForSelector('div[role="button"]');
  if (!button) {
    logger.error('Could not find button with selector: div[role="button"]');
    return false;
  }
  await button.click();

  // check for ig TV
  if (content.type === PostableContentType.Video) {
    const duration = await getVideoLength(content.filePath);
    if (duration >= 60) {
      return await createInstagramTV(page, content);
    }
  }

  // click create ig post option
  const menu = await page.waitForSelector('[role="menu"]');
  if (!menu) {
    logger.error('Could not find menu with selector: [role="menu"]');
    return false;
  }
  await menu.evaluate((e) => {
    (e.firstChild?.firstChild?.firstChild as HTMLElement).click();
  });

  // enter the post description with tags (first tag is subreddit name)
  const sourceTag = content.source ? `#${content.source} ` : '';
  const input = `${content.caption}\n\n${sourceTag}${tags
    .map((t) => `#${t}`)
    .join(' ')}`;

  const textfield = await page.waitForSelector('[style*="user-select"]');
  if (!textfield) {
    logger.error(
      'Could not find textfield with selector: [style*="user-select"]'
    );
    return false;
  }
  await textfield.type(input);

  // enter location
  const locationInput = await page.waitForSelector('input[autocomplete="off"]');
  if (!locationInput) {
    logger.error(
      'Could not find locationInput with selector: input[autocomplete="off"]'
    );
    return false;
  }
  await locationInput.type(process.env.TIME_ZONE || 'Europe/Vienna');
  await locationInput.press('Enter');

  // upload content
  const dropdown = await page.waitForSelector(
    '[aria-haspopup="true"][aria-controls]'
  );
  if (!dropdown) {
    logger.error(
      'Could not find dropdown with selector: [aria-haspopup="true"][aria-controls]'
    );
    return false;
  }
  await dropdown.click();
  const upload = await page.waitForSelector('input[accept="video/*, image/*"]');
  if (!upload) {
    logger.error(
      'Could not find upload with selector: input[accept="video/*, image/*"]'
    );
    return false;
  }
  await upload.uploadFile(content.filePath);

  await page.waitForXPath('//div[contains(text(), "100%")]', {
    timeout: 60_000,
  });

  // publish
  const publishButton = await page.waitForSelector(
    '[style*="background-clip"]'
  );

  if (process.env.NODE_ENV === 'production') {
    if (!publishButton) {
      logger.error(
        'Could not find publishButton with selector: [style*="background-clip"]'
      );
      return false;
    }
    await publishButton.click();
    logger.info('Created new Post!', { content });
  }

  await page.browser().close();

  return true;
}

/**
 * @todo
 */
async function createInstagramTV(
  page: Page,
  content: PostableContent
): Promise<boolean> {
  // click create ig TV option
  const menu = await page.waitForSelector('[role="menu"]');
  if (!menu) {
    logger.error('Could not find menu with selector: [role="menu"]');
    return false;
  }
  await menu.evaluate((e) => {
    (e.firstChild?.firstChild?.firstChild as HTMLElement).click();
  });

  await page.browser().close();
  return true;
}
