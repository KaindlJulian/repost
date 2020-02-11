import { Bot } from './Bot';
import { BotOptions } from '../types/BotOptions';

const args = process.argv.slice(2);

console.log(args);

const options: BotOptions = {
  subreddit: args[0],
  schedule: args[1],
  instagramCredentials: {
    username: args[2],
    password: args[3],
  },
};

const bot = new Bot(options);

bot.start();

// stop the bot before the process exits
process.on('SIGINT', () => {
  bot.stop();
});
