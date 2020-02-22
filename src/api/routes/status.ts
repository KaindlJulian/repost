import { FastifyInstance, RouteShorthandOptions } from 'fastify';

export const status = (fastify: FastifyInstance, opts: any, done: Function) => {
  /**
   * Get all bot status
   */
  fastify.get('/status', statusesOptions, (request, response) => {});

  /**
   * Get specific bot status
   */
  fastify.get('/status/:name', statusOptions, (request, response) => {});

  done();
};

// route schemas for validation and docs

const statusesOptions: RouteShorthandOptions = {
  schema: {
    description: 'Get all statuses for running bots',
    summary: 'Get all statuses',
    tags: ['status'],
    security: [
      {
        apiKey: [],
      },
    ],
    response: {
      200: {
        type: 'array',
        description: 'Successful Response',
        items: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'online',
              description:
                '"online", "stopping", "stopped", "launching", "errored", or "one-launch-status"',
            },
            monit: {
              type: 'object',
              properties: {
                memory: {
                  type: 'number',
                  example: '3250000',
                  description: ' The number of bytes the process is using.',
                },
                cpu: {
                  type: 'number',
                  example: '0.12',
                  description:
                    'The percent of CPU being used by the process at the moment.',
                },
              },
            },
            env: {
              type: 'object',
              properties: {
                uptime: {
                  type: 'number',
                  example: '604800',
                  description: 'The uptime of the bot.',
                },
                instances: {
                  type: 'number',
                  example: '2',
                  description: 'The number of running instances.',
                },
              },
            },
          },
        },
      },
    },
  },
};

const statusOptions: RouteShorthandOptions = {
  schema: {
    description: 'Get the status of a bot',
    summary: 'Get the status of a bot',
    tags: ['status'],
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
    response: {
      200: {
        type: 'object',
        description: 'Successful Response',
        properties: {
          status: {
            type: 'string',
            example: 'online',
            description:
              '"online", "stopping", "stopped", "launching", "errored", or "one-launch-status"',
          },
          monit: {
            type: 'object',
            properties: {
              memory: {
                type: 'number',
                example: '3250000',
                description: ' The number of bytes the process is using.',
              },
              cpu: {
                type: 'number',
                example: '0.12',
                description:
                  'The percent of CPU being used by the process at the moment.',
              },
            },
          },
          env: {
            type: 'object',
            properties: {
              uptime: {
                type: 'number',
                example: '604800',
                description: 'The uptime of the bot.',
              },
              instances: {
                type: 'number',
                example: '2',
                description: 'The number of running instances.',
              },
            },
          },
        },
      },
    },
  },
};
