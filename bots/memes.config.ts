export function memes() {
  return {
    name: 'memes',
    args: `--subreddits memes,dankmemes,funny,wholesomememes,me_irl,toiletpaperusa --schedule "0 5,10,15,20 * * *" --insta ${process.env.IG_TEST_USER}:${process.env.IG_TEST_PASS} --tags meme,memes,funny,lmao,dankmemes --explore`,
  };
}
