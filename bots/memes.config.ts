export function memes() {
  return {
    name: 'memes',
    args: `--subreddits memes,dankmemes,deepfriedmemes,wholesomememes --schedule "0 10,20 * * *" --insta ${process.env.IG_TEST_USER}:${process.env.IG_TEST_PASS} --tags meme,memes,funny,lmao,dankmemes --explore`,
  };
}
