import assert from 'assert';
import app from '../../src/app';
import createModel from '../../src/models/workflow-list.model';
import s3Uploader from '../mock/s3Uploader';
import { data, getUuid } from '../mock/data';

const proxyquire = require('proxyquire');
describe('\'workflow-list\' service', () => {
  let recordingId = data.recordingId;
  let domId1 = data.dom_uuid;
  let domId2 = getUuid();
  let domId3 = getUuid();
  let workflow: any = null;
  let payload = {
    'recording_id': recordingId,
    'id': 1,
    'workflow_name': 'Sample flow',
    'workflow_sequences': [
      {
        'dom_uuid': domId1,
        'dom_position': 1,
        'wait_type': 'TIME',
        'delay_interval': '100',
        'event_id': null,
        'checked': true
      },
      {
        'dom_uuid': domId2,
        'dom_position': 2,
        'wait_type': 'TIME',
        'delay_interval': '100',
        'event_id': null,
        'checked': true
      }
    ],
    'recording_type': 0,
    'allow_loop': true
  };
  const loadValues = () => {
    recordingId = data.recordingId;
    domId1 = data.dom_uuid;
    domId2 = getUuid();
    domId3 = getUuid();
    payload = {
      'recording_id': recordingId,
      'id': 1,
      'workflow_name': 'Sample flow',
      'workflow_sequences': [
        {
          'dom_uuid': domId1,
          'dom_position': 1,
          'wait_type': 'TIME',
          'delay_interval': '100',
          'event_id': null,
          'checked': true
        },
        {
          'dom_uuid': domId2,
          'dom_position': 2,
          'wait_type': 'TIME',
          'delay_interval': '100',
          'event_id': null,
          'checked': true
        }
      ],
      'recording_type': 0,
      'allow_loop': true
    };
  };
  const { WorkflowList } = proxyquire(
    '../../src/services/workflow-list/workflow-list.class',
    {
      '../../utilities/s3-uploader': s3Uploader,
    });
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };
  const workflowList = new WorkflowList(options, app);
  it('registered the service', () => {
    loadValues();
    const service = app.service('workflow-list');
    assert.ok(service, 'Registered the service');
  });
  it('Able to create workflow for web', async () => {
    const result = await workflowList.createWorkflow(payload);
    assert.equal(result.workflow_sequences.length, 2);
  });
  it('Able to create workflow for desktop', async () => {
    const desktopPayload = JSON.parse(JSON.stringify(payload));
    desktopPayload.recording_type = 1;
    const result = await workflowList.createWorkflow(desktopPayload);
    workflow = result;
    assert.equal(result.workflow_sequences.length, 2);
  });
  it('Able to get workflow playback by id', async () => {
    const result = await workflowList.getWorkflowPlayback({
      query: {
        workflow_id: workflow.workflow_id
      }
    });
    assert.equal(result.workflow.workflow_sequences.length, 2);
  });
  it('Able to update workflow', async () => {
    if (workflow) {
      const [workflow_sequence1, workflow_sequence2] = workflow.workflow_sequences.map((sequence: any) => ({
        ...sequence,
        wait_type: 'TIME',
        checked: true
      }));
      const payload = {
        ...workflow,
        'deletedSequences': [workflow_sequence2.workflow_sequence_id],
        'updatedSequences': [
          workflow_sequence1
        ],
        'newSequences': [
          {
            'dom_uuid': domId3,
            'dom_position': 2,
            'wait_type': 'TIME',
            'delay_interval': '100',
            'event_id': null,
            'checked': true
          }
        ]
      };
      const result = await workflowList.updateWorkflow(workflow.workflow_id, payload);
      assert.equal(result.workflow_sequences.length, 2);
    }
  });
});
