import { launch, Page } from 'puppeteer';
import { LAUNCH_OPTIONS, URLS, GALAXY_S5 } from './task.config';
import { Randomizer } from '../Randomizer';
import { InstagramCredentials } from '../../types';
import { loginInstagramAccount } from './loginInstagramAccount';
import { logger } from '../../logger';

/**
 * This function should emulate some real user activity.
 * It does the following with lots of random parameters:
 * 1) Go to explore page
 * 2) Scroll a random amount
 * 3) Make some random mouse movement
 * 4) Click
 * 5) Determined by a random percentage, like the image (percentage is alway 5 < p < 35)
 * 6) Check if max likes are reached (max likes is random between 0 and 4)
 * 7) If not reached go to 2)
 *
 * All these steps should take some time since there are pauses and mousemove has
 * multiple steps.
 */
export async function exploreAndLike(
  credentials: InstagramCredentials,
  randomizer: Randomizer
): Promise<boolean> {
  const browser = await launch(LAUNCH_OPTIONS);
  const page = await browser.newPage();

  const success = await loginInstagramAccount(page, credentials);

  if (!success) {
    return false;
  }

  const maxLikes = randomizer.number(0, 4);

  logger.info('Exploring and liking posts', { amount: maxLikes });

  // 1) Go to explore page
  await page.goto(URLS.INSTAGRAM_EXPLORE, { waitUntil: 'networkidle2' });
  await page.emulate(GALAXY_S5);

  for (let likes = 0; likes < maxLikes; ) {
    // 2) Scroll a random amount
    const scrollAmount = randomizer.number(2, 6);

    for (let i = 0; i < scrollAmount; i++) {
      const toScroll = randomizer.number(50, 1000);
      await scroll(page, toScroll);
    }

    // 3) Make some random mouse movement
    const mouseMoveAmount = randomizer.number(2, 6);

    for (let i = 0; i < mouseMoveAmount; i++) {
      const xCoord = randomizer.number(16, page.viewport().width - 16);
      const yCoord = randomizer.number(48, page.viewport().height - 48);
      await moveMouse(page, {
        xCoord,
        yCoord,
      });
    }

    // 4) Click
    await page.mouse.down();
    await page.mouse.up();

    // 5) Randomly like posts
    if (randomizer.evaluatePercentage(randomizer.float(0.05, 0.45))) {
      const likeButton = await page.waitForSelector('svg[aria-label="Like"]');
      await likeButton.tap();
      logger.info('Liked a post!', page.url);
      likes++;
    }

    await page.waitFor(1000);
    const backButton = await page.$('a[href="/explore/"]');

    if (backButton) {
      await backButton.tap();
    }
  }

  return true;
}

async function scroll(page: Page, yCoord: number) {
  console.log('scrolling to', yCoord);

  await page.evaluate((yCoord) => {
    console.log(yCoord);
    window.scrollBy(yCoord, window.innerHeight);
  }, yCoord);
}

async function moveMouse(page: Page, to: { xCoord: number; yCoord: number }) {
  console.log('moving mouse', to);
  const mouse = page.mouse;
  await mouse.move(to.xCoord, to.yCoord, { steps: 10 });
}
