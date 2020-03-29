import { FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import { logger } from '../logger';

export const authenticate = (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>,
  done: any
) => {
  logger.info(process.env.NODE_ENV!);
  if (process.env.NODE_ENV === 'development') {
    logger.info('Skipping authentication', { NODE_ENV: process.env.NODE_ENV });
    done();
    return;
  }
  if (!request.headers.authorization) {
    reply.header('WWW-Authenticate', 'API-KEY');
    done(new Error("'authorization' header is missing or empty"));
  }
  if (request.headers.authorization !== process.env.API_KEY) {
    logger.warn('Authentication failed with request:', request);
    done(new Error('Incorrect API Key was provided'));
  }
  done();
};
