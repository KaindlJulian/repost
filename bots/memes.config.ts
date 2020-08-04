export function memes() {
  return {
    name: 'memes',
    args: `--subreddits memes,dankmemes,deepfriedmemes,wholesomememes --schedule "0 7,14,21 * * *" --insta ${process.env.IG_TEST_USER}:${process.env.IG_TEST_PASS} --tags meme,memes,funny,lmao,dankmemes --explore`,
  };
}
