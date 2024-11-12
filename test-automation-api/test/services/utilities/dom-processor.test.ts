import assert from 'assert';
import jsdom from 'jsdom';
import appBull from '../../mock/appBull';
import { data } from '../../mock/data';
const { JSDOM } = jsdom;

const proxyquire = require('proxyquire');

describe('\'Dom processor\' utility class', () => {
  const { DomProcessor } = proxyquire(
    '../../../src/utilities/dom-processor',
    {
      '../process-queues/appBull': appBull,
    });
  const domProcessor = new DomProcessor();
  it('Able to get resources', () => {
    const dom = new JSDOM(data.dom);
    domProcessor.getResources(dom.window.document.documentElement, data.baseURI);
  });
  it('Able to remove attributes from html', () => {
    const result = domProcessor.removeAttributesFromHtml(data.dom);
    assert.equal(typeof result, 'string');
  });
});
