import assert from 'assert';
import appBull from '../mock/appBull';
import { getScreenshotBufferByUrl } from '../mock/constants';
const proxyquire = require('proxyquire');
describe('\'S3 upload consumer\'', () => {
  const { default: ScreenshotProcessConsumer } = proxyquire('../../src/process-queues/screenshot-process-consumer',
    {
      './appBull': appBull,
      '../utilities/constants': { getScreenshotBufferByUrl }
    }
  );
  const consumer = new ScreenshotProcessConsumer();
  it('Able add job to screenshot queue', async () => {
    await consumer.processScreenshot({
      dom_path: 'https://dpl-cdn.e5.ai/test-case/web/OGQvFgFWxJmJwsGscyyHHNjOIxJSzCMAMsRI',
      viewport: {
        width: 1680,
        height: 479
      }
    });
  });
});
