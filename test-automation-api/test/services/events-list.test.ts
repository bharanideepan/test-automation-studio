import assert from 'assert';
import app from '../../src/app';

describe('\'events-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('events-list');

    assert.ok(service, 'Registered the service');
  });
});
