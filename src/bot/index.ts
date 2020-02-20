import { Bot } from './Bot';
import { BotOptions } from '../types';

const args = process.argv.slice(2);

const options: BotOptions = {
  subredditNames: [args[0]], // todo
  schedule: args[1],
  instagramCredentials: {
    username: args[2],
    password: args[3],
  },
  tags: args.slice(4),
};

const bot = new Bot(options);

bot.start();

// stop the bot before the process exits
process.on('SIGINT', () => {
  bot.stop();
});
