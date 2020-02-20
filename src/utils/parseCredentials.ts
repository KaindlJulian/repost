import { InstagramCredentials } from '../types';

/**
 * Parses a string to a Credentials Object
 *
 * @param {string} credentials A string in the form of `"username:password"`
 */
export function parseCredentials(credentials: string): InstagramCredentials {
  const c = credentials.split(':');
  return {
    username: c[0],
    password: c[1],
  };
}
