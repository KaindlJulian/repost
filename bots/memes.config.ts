export const memes = {
  name: 'memes',
  instances: 1,
  autorestart: true,
  merge_logs: true,
  args:
    '--subreddits memes dankmemes --schedule "0 0 * * SUN" --insta username:password --tags tag1 tag2 tag3',
  env: {
    NODE_ENV: 'development',
  },
  env_production: {
    NODE_ENV: 'production',
  },
};
