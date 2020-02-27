import { BotOptions } from '../types';

/**
 * Generates a pm2 process startup config without the script property.
 */
export function generatePm2Config(name: string, options: BotOptions) {
  return {
    name: name,
    instances: 1,
    merge_logs: true,
    args: optionsToArgString(options),
  };
}

function optionsToArgString(options: BotOptions) {
  return `--subreddits ${options.subredditNames.join(' ')} --schedule "${
    options.schedule
  }" --insta ${options.instagramCredentials.username}:${
    options.instagramCredentials.password
  } --tags ${options.tags.join(' ')}`;
}
