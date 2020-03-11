import assert from 'assert';
import { Cache } from '../../../src/bot/Cache';
import { getVideoContent } from '../../../src/bot/tasks';
import { TIMEOUT } from './config.test';

describe('getVideoContent', function() {
  this.timeout(TIMEOUT);

  before(() => {
    Cache.createInstance(60 * 60);
  });

  beforeEach(() => {
    Cache.instance.flush();
  });

  it('should resolve to undefined if url is empty', async () => {
    const result = await getVideoContent('');
    assert.strictEqual(result, undefined);
  });

  it('should resolve to undefined if subreddit doesnt exist', async () => {
    const result = await getVideoContent('https://www.reddit.com/r/0');
    assert.strictEqual(result, undefined);
  });

  it('should resolve to non-null data for existing subreddit', async () => {
    const result = await getVideoContent('https://www.reddit.com/r/gifs');
    assert.notDeepStrictEqual(result, undefined);
  });
});
