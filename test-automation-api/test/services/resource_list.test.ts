import assert from 'assert';
import app from '../../src/app';

describe('\'resource_list\' service', () => {
  it('registered the service', () => {
    const service = app.service('resource-list');

    assert.ok(service, 'Registered the service');
  });
});
