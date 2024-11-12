import app from '../../src/app';
import appBull from '../mock/appBull';
import s3uploader from '../mock/s3Uploader';
import { data, getS3UploadDomData, setUuid } from '../mock/data';
const proxyquire = require('proxyquire');
describe('\'S3 dom update consumer\'', () => {
  setUuid();
  let dom_uuid = data.dom_uuid;
  let recording_id = data.recordingId;
  let dom_path = `https://dpl-cdn.e5.ai/test-case/web/${dom_uuid}`;
  it('Able to update s3 object', async () => {
    dom_uuid = data.dom_uuid;
    recording_id = data.recordingId;
    dom_path = `https://dpl-cdn.e5.ai/test-case/web/${dom_uuid}`;
    const recording = {
      recording_id: recording_id,
      recording_name: 'Sample recording 1',
      id: '1',
    };
    const dom = {
      recording_id: recording_id,
      dom_path: dom_path,
      dom_time_stamp: new Date(),
      dom_uuid: dom_uuid,
      width: 1680,
      height: 495
    };
    // Should create these records to pass all test cases
    await app.service('recordings-list').create(recording);
    await app.service('dom-list').create(dom);
    const { default: S3DomUpdateConsumer } = proxyquire('../../src/process-queues/s3-dom-update-consumer',
      {
        './appBull': appBull,
        '../utilities/s3-uploader': s3uploader
      }
    );
    const consumer = new S3DomUpdateConsumer();
    await consumer.uploadFileToS3(getS3UploadDomData());
  });
});
