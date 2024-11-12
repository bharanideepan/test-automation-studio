import assert from 'assert';

import { getScreenshotBufferByUrl } from '../../../src/utilities/constants';

describe('\'Constants\' utility', () => {

  it('initialize the class', async () => {
    const buffer = await getScreenshotBufferByUrl('https://www.google.com/', {
      'width': 1680,
      'height': 479
    });
    assert.equal(typeof buffer, 'object');
  });
});
