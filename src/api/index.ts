import fastify from 'fastify';
import auth from 'fastify-auth';
import cors from 'fastify-cors';
import { logger } from '../logger';
import { authenticate } from './authenticate';
import { registerSwagger } from './swagger';
import * as routes from './routes';

if (process.env.NODE_ENV === 'production' && !process.env.API_KEY) {
  logger.error('Tried to start production api without API_KEY');
  process.exit(1);
}

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const server = fastify({ logger: false });

server.decorate('authenticate', authenticate);
server.register(cors);
registerSwagger(server);

server.get('/', {}, (request, response) => {
  response.send({
    api: {
      sub: '/api',
      auth: {
        header: 'authorization',
        value: 'API_KEY',
      },
    },
    documentation: { sub: '/documentation' },
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

server.listen(PORT, '0.0.0.0', err => {
  if (err) {
    throw err;
  }
  logger.info(`Server listening on ${PORT}`);
});
