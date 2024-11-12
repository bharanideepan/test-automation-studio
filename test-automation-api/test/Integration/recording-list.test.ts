// import { assert, expect } from 'chai';
// import { Server } from 'http';
// import { faker } from '@faker-js/faker';
// import app from '../../src/app';
// import { makePostRequest, port, makeGetRequest } from '../util/request';

// describe('\'Recording-list API integration test\'', () => {
//   let server: Server;
//   let recording_id: any;

//   before(function (done) {
//     server = app.listen(port);
//     server.once('listening', () => done());
//   });

//   after(function (done) {
//     server.close(done);
//   });
//   it('Able to create recording', async () => {
//     recording_id = faker.datatype.uuid();
//     const recording = {
//       recording_id: recording_id,
//       recording_name: 'Sample recording',
//       id: '1',
//     };
//     const result = await app.service('recordings-list').create(recording);
//     assert.equal(result.recording_name, 'Sample recording');
//   });
//   it('Able to create a dom for recording', async () => {
//     const dom_uuid = faker.datatype.uuid();
//     const payload = {
//       recording_id: recording_id,
//       dom_path: 'https://dpl-cdn.e5.ai/test-case/web/aadb9412-4751-4ea2-ac60-0a62c1d722aa',
//       dom_time_stamp: new Date(),
//       dom_uuid: dom_uuid,
//       width: 1680,
//       height: 495
//     };
//     const result = await app.service('dom-list').create(payload);
//     assert.equal(result.dom_uuid, dom_uuid);
//   });
//   it('Able to get recording by id', async () => {
//     const { data } = await makeGetRequest(`recordings-list/${recording_id}`);
//     assert.equal(data.recording_id, recording_id);
//   });
//   it('Able to get dom list by recording id', async () => {
//     const { data } = await makeGetRequest(`recordings-list/dom-list/${recording_id}`);
//     expect(data.data).to.be.an('array');
//   });
//   it('Able to duplicate recording by recording id', async () => {
//     const { data } = await makePostRequest('recording-list/duplicate', { recording_id });
//     assert.equal(data.recording_id, recording_id.toUpperCase());
//   });
//   it('Able to scramble recording by recording id', async () => {
//     const { data } = await makePostRequest('recording-list/scramble-recording', { recording_id });
//     assert.equal(data.id, data.recording_id);
//   });
//   it('Able to take screenshots by recording id', async () => {
//     const { data } = await makePostRequest('recording-list/take-screenshot', { recording_id });
//     expect(data).to.have.property('message');
//   });
//   it('Able to remove specified attribute in all doms', async () => {
//     const { data } = await makeGetRequest('remove-attribute', { recordingId: recording_id });
//     expect(data[0]).to.have.property('id');
//   });
// });