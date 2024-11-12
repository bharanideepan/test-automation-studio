import assert from 'assert';
import appBull from '../mock/appBull';
import s3uploader from '../mock/s3Uploader';
import { getS3UploadDomData, getS3UploadScreenshotData, getS3UploadData } from '../mock/data';
const proxyquire = require('proxyquire');
describe('\'S3 upload consumer\'', () => {
  const { default: S3UploadConsumer } = proxyquire('../../src/process-queues/s3-upload-consumer',
    {
      './appBull': appBull,
      '../utilities/s3-uploader': s3uploader
    }
  );
  const consumer = new S3UploadConsumer();
  it('Able to upload dom', async () => {
    await consumer.uploadFileToS3(getS3UploadDomData());
  });
  it('Able to upload screenshot', async () => {
    await consumer.uploadFileToS3(getS3UploadScreenshotData());
  });
  it('Able to upload data', async () => {
    await consumer.uploadFileToS3(getS3UploadData());
  });
});
