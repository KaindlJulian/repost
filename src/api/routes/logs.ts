import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import { getProcessLogs } from '../../utils';

export const logs = (fastify: FastifyInstance, opts: any, done: Function) => {
  fastify.addHook('preHandler', fastify.auth([fastify.authenticate]));

  /**
   * Get specific bot logs
   */
  fastify.get('/logs/:name', logsOptions, async (request, response) => {
    const buffer = await getProcessLogs(request.params.name);
    response.send(buffer);
  });

  done();
};

// route schemas for validation and docs

const logsOptions: RouteShorthandOptions = {
  schema: {
    tags: ['logs'],
    description: 'Returns the logs for given bot process',
    summary: 'Returns logs for a bot',
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
