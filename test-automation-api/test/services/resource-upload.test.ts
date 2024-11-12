import { assert, expect } from 'chai';
import app from '../../src/app';
import createModel from '../../src/models/resource-upload.model';
import appBull from '../mock/appBull';
import s3Uploader from '../mock/s3Uploader';
import fs from 'fs';
import { getDomEntity } from '../mock/data';

const proxyquire = require('proxyquire');
describe('\'resource-upload\' service', () => {
  const domEntity = getDomEntity();
  const { ResourceUpload } = proxyquire(
    '../../src/services/resource-upload/resource-upload.class',
    {
      '../../utilities/s3-uploader': s3Uploader,
      '../../process-queues/appBull': appBull
    });
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };
  const resourceUpload = new ResourceUpload(options, app);

  it('registered the service', () => {
    const service = app.service('resource-upload');
    assert.ok(service, 'Registered the service');
  });
  it('Able to upload resource', async () => {
    const result = await resourceUpload.uploadResource('content');
    assert.equal(result.body, 'content');
  });
  it('Able to upload zip to s3', async () => {
    const file = fs.readFileSync('test/mock/files/payload.zip');
    const result = await resourceUpload.uploadZipToS3(file, 'some_id');
    assert.equal(result, 'some_id');
  });
  it('Able to create dom scrap from json', async () => {
    const result = await resourceUpload.createDataScrapJson(domEntity);
    assert.equal(result.dom_uuid, domEntity.dom_uuid);
  });
  // it('Able to create dom scrap from zip file', () => {
  //   const buffer = fs.readFileSync('test/mock/files/payload.zip');
  //   const result = resourceUpload.createDataScrap({ file: [buffer] });
  //   console.log(result);
  // });

});
