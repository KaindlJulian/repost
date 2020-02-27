import { InstagramCredentials } from '../types';
import { logger } from '../logger';

/**
 * Parses a string to a Credentials Object
 *
 * @param {string} credentials A string in the form of `"username:password"`
 */
export function parseCredentials(credentials: string): InstagramCredentials {
  const c = credentials.split(':');

  if (c.length < 2) {
    logger.warn('Failed to parse credentials', credentials);
    throw 'Could not parse credentials';
  }

  return {
    username: c[0],
    password: c[1],
  };
}
