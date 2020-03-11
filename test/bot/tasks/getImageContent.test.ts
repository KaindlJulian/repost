import assert from 'assert';
import { Cache } from '../../../src/bot/Cache';
import { getImageContent } from '../../../src/bot/tasks';
import { TIMEOUT } from './config.test';

describe('getImageContent', function() {
  this.timeout(TIMEOUT);

  before(() => {
    Cache.createInstance(60 * 60);
  });

  beforeEach(() => {
    Cache.instance.flush();
  });

  it('should resolve to undefined if url is empty', async () => {
    const result = await getImageContent('');
    assert.strictEqual(result, undefined);
  });

  it('should resolve to undefined if there are no images loading', async () => {
    const result = await getImageContent('https://www.reddit.com/r/0');
    assert.strictEqual(result, undefined);
  });

  it('should resolve to non-null data for existing subreddit', async () => {
    const result = await getImageContent('https://www.reddit.com/r/images');
    assert.notDeepStrictEqual(result, undefined);
  });
});
