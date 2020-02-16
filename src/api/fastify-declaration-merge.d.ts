import * as fastify from 'fastify';
import * as http from 'http';
import auth, { Options } from 'fastify-auth';

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse
  > {
    authenticate(): void;
  }
}
