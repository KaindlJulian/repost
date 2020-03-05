import devices from 'puppeteer/DeviceDescriptors';

const GALAXY_S5 = devices['Galaxy S5'];

const RUN_HEADLESS: boolean =
  process.env.NODE_ENV === 'production' ? true : false;

const FILE_DOWNLOAD_DIR = '../../../temp/downloads';

const INSTAGRAM_ULR = 'https://www.instagram.com';
const INSTAGRAM_LOGIN_PAGE = `${INSTAGRAM_ULR}/accounts/login/`;

export {
  RUN_HEADLESS,
  INSTAGRAM_ULR,
  INSTAGRAM_LOGIN_PAGE,
  GALAXY_S5,
  FILE_DOWNLOAD_DIR,
};
