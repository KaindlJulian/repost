import { InstagramCredentials } from './InstagramCredentials';

export interface BotOptions {
  subreddit: string;
  schedule: string;
  instagramCredentials: InstagramCredentials;
}
