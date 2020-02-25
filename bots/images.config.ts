export const images = {
  name: 'images',
  instances: 1,
  merge_logs: true,
  args:
    '--subreddits images earthporn --schedule "0 0 * * SUN" --insta username:password --tags tag1 tag2 tag3',
  env: {
    NODE_ENV: 'development',
  },
  env_production: {
    NODE_ENV: 'production',
  },
};
