import assert from 'assert';
import appBull from '../mock/appBull';
import resourceDownloader from '../mock/resourceDownloader';
const proxyquire = require('proxyquire');
describe('\'Resource download consumer\'', () => {
  const { default: ResourceDownloadConsumer } = proxyquire('../../src/process-queues/resource-download-consumer',
    {
      './appBull': appBull,
      '../utilities/resource-downloader': resourceDownloader
    }
  );
  const consumer = new ResourceDownloadConsumer();
  it('Able to download resource - text/css', async () => {
    await consumer.downloadResource('https://dpl-cdn.e5.ai/test-case/web/OGQvFgFWxJmJwsGscyyHHNjOIxJSzCMAMsRI/text/css', 'OGQvFgFWxJmJwsGscyyHHNjOIxJSzCMAMsRI');
  });
  it('Able to download resource - plaintext', async () => {
    await consumer.downloadResource('https://dpl-cdn.e5.ai/test-case/web/OGQvFgFWxJmJwsGscyyHHNjOIxJSzCMAMsRI', 'OGQvFgFWxJmJwsGscyyHHNjOIxJSzCMAMsRI');
  });
});
