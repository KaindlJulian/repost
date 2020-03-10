import devices from 'puppeteer/DeviceDescriptors';
import { LaunchOptions } from 'puppeteer';

const GALAXY_S5 = devices['Galaxy S5'];

const LAUNCH_OPTIONS: LaunchOptions = {
  headless: process.env.NODE_ENV === 'production' ? true : false,
  slowMo: process.env.NODE_ENV === 'production' ? undefined : 100,
};

const FILE_DOWNLOAD_DIR = '../../../temp/downloads';

const INSTAGRAM_ULR = 'https://www.instagram.com';
const INSTAGRAM_LOGIN_PAGE = `${INSTAGRAM_ULR}/accounts/login/`;

export {
  LAUNCH_OPTIONS,
  INSTAGRAM_ULR,
  INSTAGRAM_LOGIN_PAGE,
  GALAXY_S5,
  FILE_DOWNLOAD_DIR,
};
