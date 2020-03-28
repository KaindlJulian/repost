import { BotOptions } from '../types';

/**
 * Generates a pm2 process startup config without the script property.
 */
export function generatePm2Config(name: string, options: BotOptions) {
  return {
    name: name,
    instances: 1,
    error_file: `${process.env.HOME!}/.pm2/logs/${name}.log`,
    out_file: `${process.env.HOME!}/.pm2/logs/${name}.log`,
    log_file: `${process.env.HOME!}/.pm2/logs/${name}.log`,
    max_memory_restart: '150M',
    merge_logs: true,
    args: optionsToArgString(options),
  };
}

function optionsToArgString(options: BotOptions) {
  return `--subreddits ${options.subredditNames.join(' ')} --schedule "${
    options.schedule
  }" --insta ${options.instagramCredentials.username}:${
    options.instagramCredentials.password
  } --tags ${options.tags.join(' ')} ${options.explore ? '--explore' : ''}`;
}
