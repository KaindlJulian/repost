import { launch } from 'puppeteer';
import { PostContent } from '../../types';

const REDDIT_POST_IMAGE_SELECTOR = 'img.ImageBox-image.media-element';

export async function getImageAndText(
  redditUrl: string
): Promise<PostContent | undefined> {
  const browser = await launch({ headless: true });
  const page = await browser.newPage();

  page.goto(redditUrl);

  // wait until first image is loaded
  await page.waitForSelector(REDDIT_POST_IMAGE_SELECTOR);

  // click image to open popup
  page.click(REDDIT_POST_IMAGE_SELECTOR);

  const data = await page.evaluate(() => {
    const title = document.querySelectorAll('h1')[1].textContent;
    let image = null;
    document.querySelectorAll(REDDIT_POST_IMAGE_SELECTOR).forEach(e => {
      if (window.getComputedStyle(e).maxHeight === '700px') {
        image = e.getAttribute('src');
      }
    });

    if (image && title) {
      return {
        imageUrl: image,
        caption: title,
      };
    } else {
      return undefined;
    }
  });

  return data;
}
