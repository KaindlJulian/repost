export const memes = {
  name: 'memes',
  instances: 1,
  merge_logs: true,
  args: `--subreddits memes dankmemes --schedule "0 10 * * *" --insta ${process.env.IG_TEST_USER}:${process.env.IG_TEST_PASS} --tags meme memes funny lmao dankmemes --explore`,
};
