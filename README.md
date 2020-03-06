# Repost Bot

> Post reddit content to instagram

## Usage

You can define multiple bots that will run on a schedule. Each scheduled run a bot will go to one of the subreddits specified and search for content. After that the bot logs into instragram with given credentials and create a new post.

### Bot Arguments

All bots are started and managed by pm2. Bot options are passed by arguments. You can either load bots on startup or start them [via api endpoint](https://ig-repost-bot.herokuapp.com/documentation/static/index.html#/bot/post_api_bot).

**required**:

- `--subreddits`: List subbredit names
- `--schedule`: The bots posting schedule in crontab syntax (seconds granularity)
- `--insta`: The instragram credentials as `"username:password"`

**optional**:

- `--tags`: List of tag names (without #) included on every post

### Load Bots on Startup

On startup all the bots exported from `/bots` will be loaded. A bot config follows the [pm2 app declaration](https://pm2.keymetrics.io/docs/usage/application-declaration/#javascript-format) and must at least contain following properties:

```ts
export const images = {
  name: 'images',
  instances: 1,
  merge_logs: true,
  args:
    '--subreddits images --schedule "0 0 * * SUN" --insta username:password',
};
```

### Api endpoints

See [api documentation](https://ig-repost-bot.herokuapp.com/documentation)

## Development Setup

Clone the repository

> git clone https://github.com/KaindlJulian/repost.git

Install dependencies

> npm install

Running the app:

1. Use `npm run dev`. This will compile all files and spin up processes (bots and api) with pm2. The bots are specified in `/bots`

2. Debug with vscode (see [launch.json](.vscode/launch.json))

When running the app with `NODE_ENV=development` api requests do not require an api key.
