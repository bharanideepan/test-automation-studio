import assert from 'assert';
import appBull from '../mock/appBull';
import domProcessor from '../mock/domProcessor';
import { data, getRecordingMetadata } from '../mock/data';
const proxyquire = require('proxyquire');
describe('\'Dom scraping consumer\'', () => {
  it('Able to scrap dom', () => {
    const { DomScraping } = proxyquire('../../src/process-queues/dom-scraping-consumer',
      {
        './appBull': appBull,
        '../utilities/dom-processor': domProcessor
      }
    );
    const consumer = new DomScraping();
    const payload = {
      recordingId: data.recordingId,
      recordingMetaData: getRecordingMetadata(),
      dom: data.dom,
      baseURI: data.baseURI,
    };
    consumer.domScraping(payload);
    consumer.getScrambledHtml(data.dom, data.recordingId);
  });
});
