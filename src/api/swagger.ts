import { FastifyInstance } from 'fastify';
import swagger from 'fastify-swagger';

export function registerSwagger(fastify: FastifyInstance) {
  fastify.register(swagger, {
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Repost API',
        description: 'This is the documentation for the repost api.',
        version: '1.0.0',
      },
      host: 'https://ig-repost-bot.herokuapp.com/api',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'authorization',
          in: 'header',
        },
      },
    },
  });
}
