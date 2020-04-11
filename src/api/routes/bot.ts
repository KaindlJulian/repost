import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import {
  startNewBot,
  listBotNames,
  addSubreddits,
  changeSchedule,
  runAction,
  getInstagramChats,
  createPost,
} from '../../pm2';
import {
  BotOptions,
  Pm2ProcessAction,
  ProcessMessage,
  MessageType,
} from '../../types';
import { isValidCron } from 'cron-validator';

export const bot = (fastify: FastifyInstance, opts: any, done: Function) => {
  fastify.addHook('preHandler', fastify.auth([fastify.authenticate]));

  /**
   * Return all bot names
   */
  fastify.get('/bot', getAllOptions, async (request, response) => {
    const names = await listBotNames();
    response.send(names);
  });

  /**
   * Create a new bot
   */
  fastify.post('/bot', createOptions, (request, response) => {
    if (
      !isValidCron(request.body.schedule, {
        seconds: true,
      })
    ) {
      response.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message:
          'Invalid crontab syntax for schedule. Try it here https://npm.runkit.com/cron-validator',
      });
    }

    const options: BotOptions = {
      subredditNames: request.body.subreddits,
      schedule: request.body.schedule,
      instagramCredentials: request.body.credentials,
      tags: request.body.tags,
      explore: request.body.explore,
    };

    startNewBot(request.body.name, options);
    response.send();
  });

  /**
   * Manually issue a post
   */
  fastify.post('/bot/:name/post', postOptions, (request, response) => {
    createPost(request.params.name, request.body.caption, request.body.content);
    response.send();
  });

  /**
   * Add subbreddits by names to a given bot
   */
  fastify.post(
    '/bot/:name/subreddit',
    subredditOptions,
    (request, response) => {
      addSubreddits(request.params.name, request.body);
      response.send();
    }
  );

  /**
   * Change the post schedule on a given bot
   */
  fastify.post('/bot/:name/schedule', scheduleOptions, (request, response) => {
    if (
      !isValidCron(request.body.newSchedule, {
        seconds: true,
      })
    ) {
      response.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message:
          'Invalid crontab syntax for schedule. Try it here https://npm.runkit.com/cron-validator',
      });
    }

    changeSchedule(request.params.name, request.body.newSchedule);
    response.send();
  });

  /**
   * Execute one of a few predefined pm2 actions on a given bot
   */
  fastify.post('/bot/:name/pm2', actionOptions, (request, response) => {
    const action: string = request.body.action;

    if (action === 'Restart' || action === 'Stop' || action === 'Delete') {
      runAction(request.params.name, Pm2ProcessAction[action]);
      response.send();
    } else {
      response.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message:
          'Following Actions are allowed: "Restart", "Stop", "Delete". Case sensitive!',
      });
    }
  });

  /**
   * Return all chats
   */
  fastify.get('/bot/:name/chat', getChatsOptions, async (request, response) => {
    const names = await listBotNames();

    if (!names.includes(request.params.name)) {
      response.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'This bot does not exist',
      });
    } else {
      process.on('message', (data) => {
        const message: ProcessMessage = data.data;
        if (message.type === MessageType.SendInstagramChatsMessage) {
          response.send(message.value);
        }
      });

      getInstagramChats(request.params.name);
    }
  });

  done();
};

// route schemas for validation and docs

const getAllOptions: RouteShorthandOptions = {
  schema: {
    tags: ['bot'],
    description: 'Get all bot names that are currently running',
    summary: 'Get all bot names',
    security: [
      {
        apiKey: [],
      },
    ],
    response: {
      200: {
        description: 'Successful Response',
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['great', 'bot', 'names'],
      },
    },
  },
};

const createOptions: RouteShorthandOptions = {
  schema: {
    tags: ['bot'],
    description: 'Create a new Repost Bot with this endpoint.',
    summary: 'Create a new Repost Bot with this endpoint.',
    security: [
      {
        apiKey: [],
      },
    ],
    body: {
      type: 'object',
      required: ['name', 'subreddits', 'schedule', 'credentials'],
      properties: {
        name: {
          type: 'string',
          example: 'myBot',
          description: 'Unique name of the bot',
        },
        subreddits: {
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
          example: ['funny', 'memes', 'deepfriedmemes'],
          description: 'The subreddits where to bot takes content from',
        },
        schedule: {
          type: 'string',
          example: '0 12 * * SUN',
          description: 'A valid crontab syntax. See https://crontab.guru',
        },
        credentials: {
          type: 'string',
          example: 'username:password',
          description: '"username:password"',
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
          example: ['one', 'two', 'three'],
          description: 'Tags that will be included in every instagram post',
        },
        explore: {
          type: 'boolean',
          example: true,
          description: 'The bot will randomly like content on the explore page',
        },
      },
    },
  },
};

const postOptions: RouteShorthandOptions = {
  schema: {
    tags: ['bot'],
    description:
      'Manually make a new post. Either provide the caption and content link (img/gif/mp4) or leave one empty and the bot handles the request like a scheduled post',
    summary: 'Manually make the bot create a post',
    security: [
      {
        apiKey: [],
      },
    ],
    params: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of a running bot',
          example: 'myBot',
        },
      },
    },
    body: {
      type: 'object',
      properties: {
        caption: {
          type: 'string',
          description: 'The caption of the new post',
          example: 'Look at my cute cat',
        },
        content: {
          type: 'string',
          description: 'Direct link to image/gif or video content',
          example: 'https://i.imgur.com/QNnL1yk.mp4',
        },
      },
    },
  },
};

const subredditOptions: RouteShorthandOptions = {
  schema: {
    tags: ['bot'],
    description:
      'Add a list of subreddits to the bots internal subreddit rotation.',
    summary: 'Add new subreddits',
    security: [
      {
        apiKey: [],
      },
    ],
    params: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of a running bot',
          example: 'myBot',
        },
      },
    },
    body: {
      type: 'array',
      items: {
        type: 'string',
      },
      minItems: 1,
      example: ['images', 'pics', 'wallpapers'],
      description:
        'A list of subreddit names to be added to the bots subreddit rotation.',
    },
  },
};

const scheduleOptions: RouteShorthandOptions = {
  schema: {
    tags: ['bot'],
    description:
      'Change the bots posting schedule. Requires a well formed crontab syntax expression. See https://linuxmoz.com/crontab-syntax-tutorial/',
    summary: 'Change the posting schedule',
    security: [
      {
        apiKey: [],
      },
    ],
    params: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of a running bot',
          example: 'myBot',
        },
      },
    },
    body: {
      type: 'object',
      required: ['newSchedule'],
      properties: {
        newSchedule: {
          type: 'string',
          description: 'A valid crontab syntax, see https://crontab.guru',
          example: '0 0 * * SUN',
        },
      },
    },
  },
};

const actionOptions: RouteShorthandOptions = {
  schema: {
    tags: ['bot'],
    description: 'Execute pm2 actions on running bots.',
    summary: 'Execute pm2 actions on running bots',
    security: [
      {
        apiKey: [],
      },
    ],
    params: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of a running bot',
          example: 'myBot',
        },
      },
    },
    body: {
      type: 'object',
      required: ['action'],
      properties: {
        action: {
          type: 'string',
          example: 'Restart',
          description:
            'The pm2 action to run for the bot. Possible values: "Stop", "Restart", "Delete".',
        },
      },
    },
  },
};

const getChatsOptions: RouteShorthandOptions = {
  schema: {
    tags: ['bot'],
    description: 'Get the direct messages of the bot account',
    summary: 'Get list of all last direct messages',
    security: [
      {
        apiKey: [],
      },
    ],
    params: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of a running bot',
          example: 'myBot',
        },
      },
    },
  },
};
