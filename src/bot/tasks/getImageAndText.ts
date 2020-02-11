import { launch } from 'puppeteer';
import { PostContent } from '../../types';

export async function getImageAndText(
  redditUrl: string
): Promise<PostContent | undefined> {
  const browser = await launch({ headless: true });
  const page = await browser.newPage();

  // open url
  page.goto(redditUrl);

  // wait until first image is loaded
  await page.waitForSelector('img.ImageBox-image.media-element');

  // click image to open popup
  page.click('img.ImageBox-image.media-element');

  const data = await page.evaluate(() => {
    const title = document.querySelectorAll('h1')[1].textContent;
    let image = null;
    document.querySelectorAll('img.ImageBox-image.media-element').forEach(e => {
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
