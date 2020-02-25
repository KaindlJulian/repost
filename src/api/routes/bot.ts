import { FastifyInstance, RouteShorthandOptions } from 'fastify';

export const bot = (fastify: FastifyInstance, opts: any, done: Function) => {
  fastify.addHook('preHandler', fastify.auth([fastify.authenticate]));

  /**
   * Return all bot names
   */
  fastify.get('/bot', getAllOptions, (request, response) => {});

  /**
   * Create a new bot
   */
  fastify.post('/bot', createOptions, (request, response) => {});

  /**
   * Add subbreddits by names to a given bot
   */
  fastify.post(
    '/bot/:name/subreddit',
    subredditOptions,
    (request, response) => {}
  );

  /**
   * Change the post schedule on a given bot
   */
  fastify.post(
    '/bot/:name/schedule',
    scheduleOptions,
    (request, response) => {}
  );

  /**
   * Execute one of a few predefined pm2 actions on a given bot
   */
  fastify.post('/bot/:name/pm2', actionOptions, (request, response) => {});

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
          example: 'lkSxrilnb00gbsnn/eajkZ3v50cFoZgByqPIbSe/whA=',
          description: '"username:password" AES encoded with the api key',
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
          example: 'restart',
          description:
            'The pm2 action to run for the bot. Possible values: "stop", "restart", "delete"',
        },
      },
    },
  },
};
