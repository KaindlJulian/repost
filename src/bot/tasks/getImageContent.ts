import { launch } from 'puppeteer';
import { Cache } from '../Cache';
import { logger } from '../../logger';
import { Content, ContentType } from '../../types';
import { LAUNCH_OPTIONS } from './task.config';

/**
 * Tries to get image and text from a subreddit
 */
export async function getImageContent(
  redditUrl: string
): Promise<Content | undefined> {
  if (redditUrl.length === 0) return undefined;

  const browser = await launch(LAUNCH_OPTIONS);
  const page = await browser.newPage();

  await page.browserContext().overridePermissions(redditUrl, []);

  await page.goto(redditUrl);

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
    return undefined;
  }

  // get all image posts
  const imagePosts = await page.$$('img.ImageBox-image.media-element');

  // filter out ads and already used posts
  const filteredPosts = imagePosts.filter(async handle => {
    const data = await handle.evaluate(e => {
      return {
        target: e.getAttribute('target')!,
        src: e.getAttribute('src')!,
      };
    });
    // _blank are ads
    return data.target !== '_blank' && !Cache.instance.has(data.src);
  });

  if (!filteredPosts) {
    return undefined;
  }

  // click image to open popup
  await page.waitFor(1000);
  await filteredPosts[0].click();
  await page.waitFor(1000);

  // get post content
  const url = await filteredPosts[0].evaluate(e => {
    const externalUrl = (e.parentElement?.parentElement?.parentElement
      ?.parentElement?.parentElement?.parentElement?.previousSibling
      ?.firstChild as HTMLElement).getAttribute('href');

    console.log(externalUrl);

    if (externalUrl) {
      return externalUrl;
    }

    return e
      .getAttribute('src')
      ?.replace('preview', 'i')
      .split('?')[0];
  });
  const title = await page.evaluate(() => {
    return document.querySelectorAll('h1')[1].textContent;
  });

  await browser.close();

  if (url && title) {
    return {
      type: ContentType.Image,
      url: url,
      caption: title,
    };
  } else {
    return undefined;
  }
}
