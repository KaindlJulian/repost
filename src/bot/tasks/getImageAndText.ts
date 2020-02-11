import { launch } from 'puppeteer';
import { PostContent } from '../../types';
import { logger } from '../../logger';

export async function getImageAndText(
  redditUrl: string
): Promise<PostContent | undefined> {
  if (redditUrl.length === 0) return undefined;

  const browser = await launch({
    headless: true,
  });
  const page = await browser.newPage();

  page.goto(redditUrl);

  try {
    // wait until first image is loaded
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

  // click image to open popup
  await page.click('img.ImageBox-image.media-element');
  await page.waitFor(1000);

  const data = await page.evaluate(() => {
    const title = document.querySelectorAll('h1')[1].textContent;

    const image = Array.from(
      document.querySelectorAll('img.ImageBox-image.media-element')
    )
      .filter(e => window.getComputedStyle(e).maxHeight === '700px')[0]
      .getAttribute('src');

    if (image && title) {
      return {
        imageUrl: image.replace('preview', 'i'),
        caption: title,
      };
    } else {
      return undefined;
    }
  });

  await browser.close();

  return data;
}
