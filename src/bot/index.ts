import { Bot } from './Bot';
import { BotOptions } from '../types';
import arg from 'arg';
import { parseCredentials } from '../utils';

const args = arg(
  {
    '--subreddits': [String],
    '--schedule': String,
    '--insta': String,
    '--tags': [String],
  },
  { permissive: false }
);

const options: BotOptions = {
  subredditNames: args['--subreddits']!,
  schedule: args['--schedule']!,
  instagramCredentials: parseCredentials(args['--insta']!),
  tags: args['--tags']!,
};

const bot = new Bot(options);

bot.start();

// react to pm2 process messages
process.on('message', data => {});

// stop the bot before the process exits
process.on('SIGINT', () => {
  bot.stop();
});
