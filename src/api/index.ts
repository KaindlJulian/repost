import fastify from 'fastify';
import auth from 'fastify-auth';
import cors from 'fastify-cors';
import { logger } from '../logger';
import { authenticate } from './authenticate';
import { registerSwagger } from './swagger';
import * as routes from './routes';

const PORT = 3000;

const server = fastify({ logger: false });

server.decorate('authenticate', authenticate);

registerSwagger(server);

server.register(cors);

server.get('/', {}, (request, response) => {
  response.send({
    api: {
      sub: '/api',
      auth: {
        header: 'Authorization',
        value: 'API_KEY',
      },
    },
    documentation: { sub: '/documentation', auth: {} },
  });
});

server.register(auth).after(() => {
  Object.values(routes).forEach(r => {
    server.register(r, { prefix: 'api' });
  });
});

server.ready(err => {
  if (err) {
    throw err;
  }
  server.swagger();
});

server.listen(PORT, err => {
  if (err) {
    throw err;
  }
  logger.info(`Server listening on ${PORT}`);
});
