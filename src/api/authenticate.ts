import { FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import { logger } from '../logger';

export const authenticate = (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>,
  done: any
) => {
  if (process.env.NODE_ENV === 'development') {
    done();
  }
  if (!request.headers.Authorization) {
    reply.header('WWW-Authenticate', 'API-KEY');
    done(new Error("'Authorization' header is missing or empty"));
  }
  if (request.headers.Authorization !== process.env.API_KEY) {
    logger.warn('Authentication failed with request:', request);
    done(new Error('Incorrect API Key was provided'));
  }
  done();
};
