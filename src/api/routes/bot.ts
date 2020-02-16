import { FastifyInstance, RouteShorthandOptions } from 'fastify';

export const bot = (fastify: FastifyInstance, opts: any, done: Function) => {
  fastify.get('/bot', getAllOptions, (request, response) => {});

  fastify.post('/bot', createOptions, (request, response) => {});

  fastify.post('/bot/:name', actionOptions, (request, response) => {});

  done();
};

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
