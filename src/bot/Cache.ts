import NodeCache from 'node-cache';
import { Content } from '../types';
import { logger } from '../logger';

const MAX_CACHE_KEYS = 100;
const LOGGED_EVENTS = ['set', 'del', 'expired', 'flush'];

export class Cache {
  private static _instance: Cache | undefined;
  private _cache: NodeCache;

  private constructor(ttl: number) {
    this._cache = new NodeCache({
      stdTTL: ttl,
      checkperiod: ttl * 0.4,
      maxKeys: MAX_CACHE_KEYS,
      useClones: false,
      forceString: false,
    });

    // we log some cache events
    LOGGED_EVENTS.forEach(e => this._cache.addListener(e, () => logEvent(e)));
  }

  static createInstance(ttl: number) {
    this._instance = new Cache(ttl);
  }

  static get instance(): Cache {
    if (!this._instance) {
      throw 'Create an instance first';
    }
    return this._instance;
  }

  /**
   * Set a cached key.
   */
  set(key: string, value: Content) {
    this._cache.set<Content>(key, value);
  }

  /**
   * Gets a saved value from the cache.
   */
  get(key: string): Content | undefined {
    return this._cache.get<Content>(key);
  }

  /**
   * Delete a key. Returns the number of deleted entries.
   */
  delete(key: string): number {
    return this._cache.del(key);
  }

  /**
   * Returns boolean indicating if the key is cached.
   */
  has(key: string): boolean {
    return this._cache.has(key);
  }

  /**
   * Flush all data.
   */
  flush() {
    this._cache.flushAll();
  }
}

/**
 * Log when cache fires an event
 */
function logEvent(event: string) {
  logger.info(`CACHE: ${event}`);
}
