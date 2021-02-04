
import {devices, LaunchOptions} from "puppeteer";


const GALAXY_S5 = devices['Galaxy S5'];

const LAUNCH_OPTIONS: LaunchOptions = {
  headless: process.env.NODE_ENV === 'production' ? true : false,
  args: process.env.NODE_ENV === 'production' ? ['--no-sandbox'] : undefined,
  slowMo: process.env.NODE_ENV === 'production' ? undefined : 100,
  ignoreDefaultArgs: ['--disable-extensions'],
};

const FILE_DOWNLOAD_DIR = '../../../downloads';

const URLS = {
  INSTAGRAM: 'https://www.instagram.com',
  INSTAGRAM_EXPLORE: 'https://www.instagram.com/explore',
  INSTAGRAM_LOGIN: 'https://www.instagram.com/accounts/login/',
  INSTAGRAM_CHATS: 'https://www.instagram.com/direct/inbox/',
  VIDEO_TO_GIF: 'https://ezgif.com/video-to-gif',
};

const NAV_TIMEOUT = 120 * 1000;

export { LAUNCH_OPTIONS, GALAXY_S5, FILE_DOWNLOAD_DIR, URLS, NAV_TIMEOUT };
