import assert from 'assert';
import app from '../../src/app';

describe('\'google-auth\' service', () => {
  it('registered the service', () => {
    const service = app.service('google-auth');

    assert.ok(service, 'Registered the service');
  });
});
