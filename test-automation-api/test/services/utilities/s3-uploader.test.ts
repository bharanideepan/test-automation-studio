import assert from 'assert';
import { expect } from 'chai';
import { S3uploader } from '../../../src/utilities/s3-uploader';


describe('\'s3-uploader\' utility class', () => {
  const s3uploader = new S3uploader();
  it('initialize the class', async () => {
    assert.ok(s3uploader, 'class initialized');
  });
  it('positive-case , should upload file to s3', async () => {
    await s3uploader.uploadFile('unit_test.txt', 'unit testing of s3 upload', 'text/plain').then((result) => {
      expect(result).to.have.property('ETag');
      expect(result).to.have.property('Location');
    });
  });
  it('Negative-case , upload file to s3', async () => {
    await s3uploader.uploadFile('', '', '').catch(err => {
      expect(err).to.have.property('code', 'UriParameterError');
    });
  });
  it('Get list of downloadable objects', async () => {
    const prefix = 'downloads/';
    const result: any = await s3uploader.getObjectList(prefix);
    expect(result).to.have.property('Contents');
  });

});