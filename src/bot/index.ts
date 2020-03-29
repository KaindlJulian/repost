import arg from 'arg';
import { Bot } from './Bot';
import { BotOptions, ProcessMessage, MessageType } from '../types';
import { parseCredentials } from '../utils';

const args = arg(
  {
    '--subreddits': [String],
    '--schedule': String,
    '--insta': String,
    '--tags': String,
    '--explore': Boolean,
  },
  { permissive: false }
);

const options: BotOptions = {
  subredditNames: args['--subreddits']!,
  schedule: args['--schedule']!,
  instagramCredentials: parseCredentials(args['--insta']!),
  tags: args['--tags']?.split(',') || [],
  explore: args['--explore'] || false,
};

const bot = new Bot(options);

bot.start();

// pm2 process messages
process.on('message', data => {
  const message: ProcessMessage = data.data;
  switch (message.type) {
    case MessageType.AddSubredditMessage:
      bot.addSubreddits(message.value);
      break;
    case MessageType.ChangeScheduleMessage:
      bot.changeSchedule(message.value);
      break;
    case MessageType.CreatePostMessage:
      bot.createPost(message.value);
      break;
  }
});

// stop the bot before the process exits
process.on('SIGINT', () => {
  bot.stop();
});
