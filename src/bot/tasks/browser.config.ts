import {
  BrowserOptions,
  ChromeArgOptions,
  devices,
  LaunchOptions,
} from 'puppeteer-core';

const GALAXY_S5 = devices['Galaxy S5'];

const LAUNCH_OPTIONS: LaunchOptions & ChromeArgOptions & BrowserOptions = {
  headless:
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'CI'
      ? true
      : false,
  args: process.env.NODE_ENV === 'production' ? ['--no-sandbox'] : undefined,
  slowMo: process.env.NODE_ENV === 'production' ? undefined : 100,
  ignoreDefaultArgs: ['--disable-extensions'],
  executablePath: require('chrome-finder')(),
};

const FILE_DOWNLOAD_DIR = '../../../downloads';

const URLS = {
  INSTAGRAM: 'https://www.instagram.com',
  INSTAGRAM_EXPLORE: 'https://www.instagram.com/explore',
  INSTAGRAM_LOGIN: 'https://www.instagram.com/accounts/login/',
  INSTAGRAM_CHATS: 'https://www.instagram.com/direct/inbox/',
  CREATOR_STUDIO: 'https://business.facebook.com/creatorstudio',
};

const NAV_TIMEOUT = 120 * 1000;

export { LAUNCH_OPTIONS, GALAXY_S5, FILE_DOWNLOAD_DIR, URLS, NAV_TIMEOUT };
