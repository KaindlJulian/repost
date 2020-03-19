/**
 * All the bots that should get started automatically.
 * Each file contains the pm2 config for one app (the bot).
 * We leave out the `script` propertiy because it will be set when starting the bots
 * from `/src/app.ts`
 *
 * https://pm2.keymetrics.io/docs/usage/application-declaration/
 */

export * from './memes.config';
