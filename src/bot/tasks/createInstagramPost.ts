import { launch } from 'puppeteer';
import { InstagramCredentials, PostContent } from '../../types';

const INSTAGRAM_ULR = 'https://www.instagram.com/';
const INSTAGRAM_LOGIN_PAGE = `${INSTAGRAM_ULR}accounts/login/`;

export async function createInstagramPost(
  credentials: InstagramCredentials,
  content: PostContent
): Promise<boolean> {
  const browser = await launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(INSTAGRAM_LOGIN_PAGE);

  // type in credentials and click submit
  await page.type('[name=username]', credentials.username);
  await page.type('[name=password', credentials.password);
  await page.click('[type=submit');

  await page.waitFor(5000);
  await page.goto(`${INSTAGRAM_ULR}${credentials.username}`);

  // post content

  return true;
}
