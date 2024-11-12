import assert from 'assert';
import { expect } from 'chai';
import app from '../../src/app';

describe('\'project-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('project-list');

    assert.ok(service, 'Registered the service');
  });
  it('Able to create project', async () => {
    const result = await app.service('project-list').create({ name: 'Sample project' });
    expect(result).to.have.property('id');
  });
  it('Able to get project', async () => {
    const result = await app.service('project-list').get(1);
    assert.equal(result.dataValues.name, 'Sample project');
  });
});
