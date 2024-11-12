import assert from 'assert';
import app from '../../src/app';

describe('\'workflow-sequence\' service', () => {
  it('registered the service', () => {
    const service = app.service('workflow-sequence');

    assert.ok(service, 'Registered the service');
  });
});
