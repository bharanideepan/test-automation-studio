import { assert, expect } from 'chai';
import app from '../../src/app';
import createModel from '../../src/models/recordings-list.model';
import domScraping from '../mock/domScrapingConsumer';
import appBull from '../mock/appBull';
import axios from '../mock/axios';
import { data, getUuid } from '../mock/data';
import domProcessor from '../mock/domProcessor';

const proxyquire = require('proxyquire');

describe('\'recordings-list\' service', () => {
  let recordingId1 = data.recordingId;
  let domId = data.dom_uuid;
  const recordingId2 = getUuid();
  const snapshotId = getUuid();
  const { RecordingsList } = proxyquire(
    '../../src/services/recordings-list/recordings-list.class',
    {
      '../../process-queues/dom-scraping-consumer': domScraping,
      '../../process-queues/appBull': appBull,
      'axios': axios,
      '../../utilities/dom-processor': domProcessor
    });
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };
  const recordingsList = new RecordingsList(options, app);

  it('registered the service', () => {
    const service = app.service('recordings-list');
    assert.ok(service, 'Registered the service');
  });

  it('Able to get dom list', async () => {
    recordingId1 = data.recordingId;
    domId = data.dom_uuid;
    const domListResponse = await recordingsList.getDomList(recordingId1);
    assert.equal(domListResponse.data[0].dom_uuid, domId);
  });
  it('Able to get window snapshot list', async () => {
    const recording2 = {
      recording_id: recordingId2,
      recording_name: 'Sample recording 2',
      id: '1',
    };
    await recordingsList.create(recording2);
    const windowSnapshot = {
      recording_id: recordingId2,
      snapshot_id: snapshotId,
      height: 1680,
      width: 495
    };
    await app.service('window-snapshots').create(windowSnapshot);
    const snapshotResponse = await recordingsList.getDomList(recordingId2);
    assert.equal(snapshotResponse.data[0].snapshot_id, snapshotId);
  });
  it('Able to get recording', async () => {
    const result = await app.service('recordings-list').get(recordingId1);
    assert.equal(result.recording_name, 'Sample recording 1');
  });
  it('Able to duplicate recording', async () => {
    const event = {
      eventType: 'mouseup',
      eventTimeStamp: '2022-12-29T06:54:55.438Z',
      eventTargetHash: -1361356578,
      eventTargetPath: '',
      recordingId: recordingId1,
      dom_uuid: domId,
      top: 168,
      left: 96,
      height: 52,
      width: 1491,
      eventName: 'Click Event',
      elementXPath: ''
    };
    await app.service('events-list').create(event);
    const result = await recordingsList.duplicateRecording({ recording_id: recordingId1 });
    assert.equal(result.recording_id, recordingId1.toUpperCase());
  });
  it('Able to scramble recording', async () => {
    const result = await recordingsList.scrambleRecording({ recording_id: recordingId1 });
    assert.equal(result[0].recordingMeta.dom_uuid, domId);
  });
  it('Able to take screenshot', async () => {
    const result = await recordingsList.takeScreenshot({ recording_id: recordingId1 });
    expect(result).to.have.property('message');
  });
  it('Able to remove attributes', async () => {
    const result = await recordingsList.removeAttribute({
      query: {
        recordingId: recordingId1
      }
    });
    assert.equal(result[0].recordingMeta.dom_uuid, domId);
  });
});
