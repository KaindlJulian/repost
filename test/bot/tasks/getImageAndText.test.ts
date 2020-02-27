import assert from 'assert';
import { Cache } from '../../../src/bot/Cache';
import { getImageAndText } from '../../../src/bot/tasks';

describe('getImageAndText', function() {
  this.timeout(20000);

  before(() => {
    Cache.createInstance(60 * 60);
  });

  beforeEach(() => {
    Cache.instance.flush();
  });

  it('should resolve to undefined if url is empty', async () => {
    const result = await getImageAndText('');
    assert.strictEqual(result, undefined);
  });

  it('should resolve to undefined if there are no images loading', async () => {
    const result = await getImageAndText('https://www.reddit.com/r/0');
    assert.strictEqual(result, undefined);
  });

  it('should resolve to non-null data for existing subreddit', async () => {
    const result = await getImageAndText('https://www.reddit.com/r/images');
    assert.notDeepStrictEqual(result, undefined);
  });
});
