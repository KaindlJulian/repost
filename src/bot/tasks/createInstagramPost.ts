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
      return await createInstagramTV(page, content, tags);
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

  const textfield = await page.waitForSelector('[style*="user-select"]');
  if (!textfield) {
    logger.error(
      'Could not find textfield with selector: [style*="user-select"]'
    );
    return false;
  }
  await textfield.type(buildDescriptionString(content, tags));

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
  const published = await clickPublish(page);
  if (published) {
    logger.info('Created new Post', content);
  }

  await page.browser().close();

  return published;
}

async function createInstagramTV(
  page: Page,
  content: PostableContent,
  tags: string[]
): Promise<boolean> {
  // click create ig TV option
  const menu = await page.waitForSelector('[role="menu"]');
  if (!menu) {
    logger.error('Could not find menu with selector: [role="menu"]');
    return false;
  }
  await menu.evaluate((e) => {
    (e.firstChild?.nextElementSibling?.firstChild
      ?.firstChild as HTMLElement).click();
  });

  // enter title
  await page.waitForSelector('[style*="user-select"]');
  const textfields = await page.$$('[style*="user-select"]');
  if (!textfields[0]) {
    logger.error(
      'Could not find title textfield with selector: [style*="user-select"]'
    );
    return false;
  }
  await textfields[0].type(content.caption);

  // enter descrition with tags
  if (!textfields[1]) {
    logger.error(
      'Could not find description textfield with selector: [style*="user-select"]'
    );
    return false;
  }
  await textfields[1].type(buildDescriptionString(content, tags));

  // upload video
  const upload = await page.waitForSelector('input[accept="video/mp4"]');
  if (!upload) {
    logger.error(
      'Could not find upload with selector: input[accept="video/mp4"]'
    );
    return false;
  }
  await upload.uploadFile(content.filePath);

  await page.waitForXPath('//div[contains(text(), "100%")]', {
    timeout: 60_000,
  });

  // post to feed
  const feedCheckbox = await page.waitForSelector(
    'button[role="checkbox"][data-hover]'
  );
  if (!feedCheckbox) {
    logger.error(
      'Could not find feedCheckbox with selector: button[role="checkbox"][data-hover]'
    );
    return false;
  }
  await feedCheckbox.click();

  await page.waitForXPath('//div[contains(text(), "100%")]', {
    timeout: 180_000, // 3mins
  });

  // publish
  const published = await clickPublish(page);
  if (published) {
    logger.info('Created new Post', content);
  }

  await page.browser().close();

  return published;
}

/**
 * Builds descriptions string from caption source and tags
 */
function buildDescriptionString(
  content: PostableContent,
  tags: string[]
): string {
  // enter the post description with tags (first tag is subreddit name)
  const sourceTag = content.source ? `#${content.source} ` : '';
  return `${content.caption}\n\n${sourceTag}${tags
    .map((t) => `#${t}`)
    .join(' ')}`;
}

/**
 * Wait for publish button selector and publish if running production
 * @returns true if the image was published (or would have been if running not prod)
 */
async function clickPublish(page: Page): Promise<boolean> {
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
  }

  return true;
}
