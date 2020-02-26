# Repost Bot

> Post reddit content to instagram

## Development Setup

Clone the repository

> git clone https://github.com/KaindlJulian/repost.git

Install dependencies

> npm install

Running the app:

1. Use `npm run dev`. This will compile all files and spin up processes (bots and api) with pm2. The bots are specified in `/bots`

2. Debug with vscode (see [launch.json](.vscode/launch.json))

When running the app with `NODE_ENV=development` api requests do not require an api key.
