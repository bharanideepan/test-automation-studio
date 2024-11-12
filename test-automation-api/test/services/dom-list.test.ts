import { assert, expect } from 'chai';
import app from '../../src/app';
import appBull from '../mock/appBull';
import axios from '../mock/axios';
import s3Uploader from '../mock/s3Uploader';
import domScrapingConsumer from '../mock/domScrapingConsumer';
import { data } from '../mock/data';
import createModel from '../../src/models/dom-list.model';

const proxyquire = require('proxyquire');

describe('\'dom-list\' service', () => {
  let dom_uuid = data.dom_uuid;
  const { DomList } = proxyquire('../../src/services/dom-list/dom-list.class',
    {
      '../../process-queues/appBull': appBull,
      '../../process-queues/dom-scraping-consumer': domScrapingConsumer,
      'axios': axios,
      '../../utilities/s3-uploader': s3Uploader
    }
  );
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };
  const domList = new DomList(options, app);

  it('registered the service', () => {
    dom_uuid = data.dom_uuid;
    const service = app.service('dom-list');
    assert.ok(service, 'Registered the service');
  });

  it('Able to get dom', async () => {
    const response = await app.service('dom-list').get(dom_uuid);
    assert.equal(response.dom_uuid, dom_uuid);
  });

  it('Able to scramble dom', async () => {
    const result = await domList.scrambleDom({ dom_uuid });
    assert.equal(result.recordingMeta.dom_uuid, dom_uuid);
  });

  it('Able to get screenshot', () => {
    const response = domList.getScreenshot({ dom_uuid });
    assert.equal(response.dom_uuid, dom_uuid);
  });

  it('Able to get dynamic API list', () => {
    const response = domList.getDynamicApiList();
    assert.equal(typeof response.data, 'object');
  });

  it('Able to call dynamic API', async () => {
    const response = await domList.callDynamicApi({ key: 'iqies_otp' });
    assert.equal(response.status, 'Success');
  });

  it('Able to get downloadable files', async () => {
    const response = await domList.getDownloadableFiles();
    assert.equal(typeof response.data, 'object');
  });

  it('Able to download file from url', async () => {
    const response = await domList.download({
      query: {
        key: 'csv-file.csv'
      }
    });
    expect(response).to.have.property('name');
  });
});
