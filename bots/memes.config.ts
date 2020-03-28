export const memes = {
  name: 'memes',
  instances: 1,
  error_file: process.env.HOME! + '/.pm2/logs/memes.log',
  out_file: process.env.HOME! + '/.pm2/logs/memes.log',
  log_file: process.env.HOME! + '/.pm2/logs/memes.log',
  max_memory_restart: '150M',
  merge_logs: true,
  args: `--subreddits memes dankmemes --schedule "0 10 * * *" --insta ${process.env.IG_TEST_USER}:${process.env.IG_TEST_PASS} --tags meme memes funny lmao dankmemes --explore`,
};
