import assert from 'assert';
import { Server } from 'http';

import app from '../src/app';
import { getUrl, makeGetRequest, port } from './util/request';
import axios from 'axios';

describe('Feathers application tests', () => {
  let server: Server;

  before(function (done) {
    server = app.listen(port);
    server.once('listening', () => done());
  });

  after(function (done) {
    server.close(done);
  });

  it('starts and shows the index page', async () => {
    const response = await makeGetRequest('');
    if (response.data) {
      assert.ok(response.data.indexOf('<html lang="en">') !== -1);
    }
  });

  describe('404', async function () {
    it('shows a 404 HTML page', async () => {
      try {
        await makeGetRequest('path/to/nowhere',
          {},
          {
            'Accept': 'text/html',
          }
        );
        assert.fail('should never get here');
      } catch (error: any) {
        const { response } = error;
        assert.equal(response.status, 404);
        assert.ok(response.data.indexOf('<html>') !== -1);
      }
    });

    it('shows a 404 JSON error without stack trace', async () => {
      try {
        await makeGetRequest('path/to/nowhere');
        assert.fail('should never get here');
      } catch (error: any) {
        const { response } = error;

        assert.equal(response.status, 404);
        assert.equal(response.data.code, 404);
        assert.equal(response.data.message, 'Page not found');
        assert.equal(response.data.name, 'NotFound');
      }
    });

    it('shows a 403 error', async () => {
      try {
        await axios.get(getUrl('path/to/nowhere'));
        assert.fail('should never get here');
      } catch (error: any) {
        const { response } = error;
        assert.equal(response.status, 403);
        assert.equal(response.statusText, 'Forbidden');
        assert.equal(response.data, 'A token is required for authentication');
      }
    });

    it('shows a 401 error', async () => {
      try {
        await axios.get(getUrl('path/to/nowhere'), {
          headers: {
            'Authorization': 'Invalid token'
          }
        });
        assert.fail('should never get here');
      } catch (error: any) {
        const { response } = error;
        assert.equal(response.status, 401);
        assert.equal(response.statusText, 'Unauthorized');
        assert.equal(response.data, 'UnAuthorized');
      }
    });
  });
});
