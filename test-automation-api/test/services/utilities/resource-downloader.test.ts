import assert from 'assert';
import { S3UploadResource } from '../../../src/models/interface/s3-upload';
import { ResourceDownloader } from '../../../src/utilities/resource-downloader';
import app from '../../../src/app';

const baseUrl = app.get('base_url');
const folderPath = app.get('s3_web_folder_path');

describe('\'resource-downloader\' utility class', () => {
  const resourceDownloader = new ResourceDownloader();
  it('class initialize', () => {
    assert.ok(resourceDownloader, 'class initialized');
  });

  it('Positive Case - download file from url', async () => {
    const result: S3UploadResource = await resourceDownloader.downloadResource(`${baseUrl}${folderPath}/unit_test.txt`);
    assert.equal(result.uploadContent.toString(), 'unit testing of s3 upload');
  });
});