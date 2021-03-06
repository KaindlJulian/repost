import { launch } from 'puppeteer-core';
import { Cache } from '../Cache';
import { logger } from '../../logger';
import { Content, ContentType } from '../../types';
import { LAUNCH_OPTIONS, NAV_TIMEOUT } from './browser.config';

/**
 * Tries to get image and text from a subreddit
 */
export async function getImageContent(
  redditUrl: string
): Promise<Content | undefined> {
  if (redditUrl.length === 0) return undefined;

  const browser = await launch(LAUNCH_OPTIONS);
  logger.info('1');

  const page = await browser.newPage();
  logger.info('2');

  await page.browserContext().overridePermissions(redditUrl, []);
  logger.info('3');

  await page.goto(redditUrl, {
    waitUntil: 'networkidle2',
    timeout: NAV_TIMEOUT,
  });

  logger.info('Getting image Content from', { redditUrl });

  try {
    // wait until image posts are loaded
    await page.waitForSelector('img.ImageBox-image.media-element', {
      visible: true,
      timeout: 3000,
    });

    await page.waitFor(1000);
  } catch (err) {
    logger.error(
      `${err}. The subreddit '${redditUrl}' might not exist or doesnt contain any image posts.`
    );
    await browser.close();
    return undefined;
  }

  // get all image posts
  const imagePosts = await page.$$('img.ImageBox-image.media-element');

  // filter out ads and already used posts
  const filteredPosts = imagePosts.filter(async (handle) => {
    const data = await handle.evaluate((e) => {
      const target = e.parentElement?.parentElement?.parentElement?.getAttribute(
        'target'
      );
      return {
        target: target,
        src: e.getAttribute('src')!,
      };
    });
    // _blank are ads
    return data.target !== '_blank' && !Cache.instance.has(data.src);
  });

  if (!filteredPosts) {
    logger.error('No posts after filtering');
    return undefined;
  }

  // click image to open popup
  await page.waitFor(1000);
  await filteredPosts[0].click();
  await page.waitFor(1000);

  // get post content
  const url = await filteredPosts[0].evaluate((e) => {
    const externalUrl = (e.parentElement?.parentElement?.parentElement
      ?.parentElement?.parentElement?.parentElement?.parentElement
      ?.previousSibling?.firstChild as HTMLElement)?.getAttribute('href');

    console.log(externalUrl);

    if (externalUrl) {
      return externalUrl;
    }

    return e.getAttribute('src')?.replace('preview', 'i').split('?')[0];
  });

  const postPage = await browser.newPage();
  await postPage.goto(page.url());

  await postPage.waitForSelector('h1');

  const title = await postPage.evaluate(() => {
    return document.querySelector('[style*="--posttitle"]')?.textContent;
  });

  await browser.close();

  if (url && title) {
    return {
      type: ContentType.Image,
      url: url,
      caption: title,
      source: redditUrl.split('/r/')[1],
    };
  } else {
    return undefined;
  }
}
