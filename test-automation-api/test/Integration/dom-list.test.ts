// import { assert, expect } from 'chai';
// import { Server } from 'http';
// import app from '../../src/app';
// import { makePostRequest, port, makeGetRequest } from '../util/request';

// describe('\'Dom-list API integration test\' ', () => {
//   let server: Server;
//   let dom_uuid: any;
//   let screenshotPayload: any;

//   before(function (done) {
//     server = app.listen(port);
//     server.once('listening', () => done());
//   });

//   after(function (done) {
//     server.close(done);
//   });
//   it('Able to get dynamic api list', async () => {
//     const { data } = await makeGetRequest('dynamic-api/list');
//     expect(data.data).to.be.an('array');
//   });
//   it('Able to call dynamic api', async () => {
//     const { data } = await makePostRequest('dynamic-api', {
//       key: 'iqies_otp'
//     });
//     expect(data).to.have.property('message');
//   });
//   it('Able to get downloadable files', async () => {
//     const { data } = await makeGetRequest('download/list');
//     expect(data.data).to.be.an('array');
//   });
//   it('Able to download file', async () => {
//     const key = 'csv-file.csv';
//     const { data } = await makeGetRequest('download', { key });
//     assert.equal(data.name, key);
//   });
//   it('Able to get dom list', async () => {
//     const { data } = await makeGetRequest('dom-list');
//     expect(data).to.have.property('data');
//     if (data.data[0]) {
//       const dom = data.data[0];
//       screenshotPayload = {
//         dom_uuid: dom.dom_uuid,
//         dom_path: dom.dom_path,
//         viewport: {
//           height: dom.height,
//           width: dom.width,
//         },
//       };
//       dom_uuid = dom.dom_uuid;
//     }
//   });
//   it('Able to get dom record', async () => {
//     const { data } = await makeGetRequest(`dom-list/${dom_uuid}`, {
//       dom_uuid
//     });
//     assert.equal(data.dom_uuid, dom_uuid);
//   });
//   it('Able to add record to screenshot queue', async () => {
//     const { data } = await makePostRequest('dom-list/get-screenshot', screenshotPayload);
//     assert.equal(data.dom_uuid, dom_uuid);
//   });
//   // it('Able to scramble dom', async () => {
//   //   const { data } = await makePostRequest('dom-list/scramble-dom', { dom_uuid });
//   //   assert.equal(data.id, dom_uuid);
//   // });
// });