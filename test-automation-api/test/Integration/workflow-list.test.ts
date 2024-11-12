// import { expect } from 'chai';
// import { Server } from 'http';
// import app from '../../src/app';
// import { makePostRequest, port, makeGetRequest, makePatchRequest } from '../util/request';

// describe('\'Workflow-list API integration test\'', () => {
//   let server: Server;

//   before(function (done) {
//     server = app.listen(port);
//     server.once('listening', () => done());
//   });

//   after(function (done) {
//     server.close(done);
//   });

//   describe('\'1. Dopple web APIs\'', async () => {
//     let workflow_id: any;
//     it('Able to create workflow', async () => {
//       const { data: domData } = await makeGetRequest('dom-list');
//       const dom = domData.data[0];
//       if (dom) {
//         const payload = {
//           'recording_id': dom.recording_id,
//           'id': 1,
//           'workflow_name': 'Sample flow',
//           'workflow_sequences': [
//             {
//               'dom_uuid': dom.dom_uuid,
//               'dom_position': 1,
//               'wait_type': 'TIME',
//               'delay_interval': '100',
//               'event_id': null,
//               'checked': true
//             }
//           ],
//           'recording_type': 0,
//           'allow_loop': true
//         };
//         const { data } = await makePostRequest('workflow-list/workflow-sequence', payload);
//         workflow_id = data.workflow_id;
//         expect(data).to.have.property('workflow_id');
//       }
//     });
//     it('Able to update workflow', async () => {
//       const { data: workflowData } = await makeGetRequest(`workflow-list/${workflow_id}`);
//       const workflow = workflowData;
//       if (workflow) {
//         const workflow_sequences = workflow.workflow_sequences.map((sequence: any) => ({
//           ...sequence,
//           wait_type: 'TIME',
//           checked: true
//         }));
//         const payload = {
//           ...workflow,
//           'deletedSequences': [],
//           'updatedSequences': [
//             ...workflow_sequences
//           ],
//           'newSequences': []
//         };
//         const { data } = await makePatchRequest(`workflow-list/workflow-sequence/${workflow.workflow_id}`, payload);
//         expect(data).to.have.property('workflow_id');
//       }
//     });
//     it('Able to delete dom from workflow', async () => {
//       const { data: workflowData } = await makeGetRequest(`workflow-list/${workflow_id}`);
//       const workflow = workflowData;
//       if (workflow) {
//         const workflow_sequences = workflow.workflow_sequences.map((sequence: any) => sequence.workflow_sequence_id);
//         const payload = {
//           ...workflow,
//           'deletedSequences': [...workflow_sequences],
//           'updatedSequences': [],
//           'newSequences': []
//         };
//         const { data } = await makePatchRequest(`workflow-list/workflow-sequence/${workflow.workflow_id}`, payload);
//         expect(data).to.have.property('workflow_id');
//       }
//     });
//     it('Able to get workflow playback object', async () => {
//       const { data } = await makeGetRequest('workflow-list/playback/workflow', {
//         workflow_id
//       });
//       expect(data).to.have.property('workflow');
//     });
//   });
// });
