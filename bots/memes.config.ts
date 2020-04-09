// this is a function because we cant access the execution context of the app otherwise and wont have access to the env vars
export function memes() {
  return {
    name: 'memes',
    args: `--subreddits memes,dankmemes,deepfriedmemes --schedule "0 10,20 * * *" --insta ${process.env.IG_TEST_USER}:${process.env.IG_TEST_PASS} --tags meme,memes,funny,lmao,dankmemes --explore`,
  };
}
