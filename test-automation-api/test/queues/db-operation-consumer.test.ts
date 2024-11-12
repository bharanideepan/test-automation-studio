import assert from 'assert';
import appBull from '../mock/appBull';
const proxyquire = require('proxyquire');
describe('\'DB operation consumer\'', () => {
  it('Able to perform DB operations', () => {
    const { default: DbOperationConsumer } = proxyquire('../../src/process-queues/db-operations-consumer', { './appBull': appBull });
    const consumer = new DbOperationConsumer();
    const domList = {
      tableName: 'dom-list',
      dbUpdateData: {
        recordingId: '',
        domPath: '',
        domTimeStamp: '',
        dom: '',
        baseURI: '',
        recordingMetaData: '',
        dom_uuid: '',
        height: '',
        width: ''
      }
    };
    const resourceList = {
      tableName: 'resource-list',
      dbUpdateData: {
        resourceHash: '',
        resourceUrlHash: '',
        resourceLocation: ''
      }
    };
    const domScreenshot = {
      tableName: 'dom-screenshot',
      dbUpdateData: {
        screenshotPath: '',
        dom_uuid: ''
      }
    };
    consumer.process({ data: domList });
    consumer.process({ data: resourceList });
    consumer.process({ data: domScreenshot });
  });
});
