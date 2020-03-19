import { InstagramCredentials } from './InstagramCredentials';

export interface BotOptions {
  subredditNames: string[];
  schedule: string;
  instagramCredentials: InstagramCredentials;
  tags: string[];
  explore: boolean;
}
