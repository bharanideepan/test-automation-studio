import { rest } from 'msw';
import { randomUUID } from 'crypto';
export const handlers = [
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/dynamic-api/list`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "data": [
          {
            "name": "label",
            "key": "value"
          }
        ]
      })
    )
  }),
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/download/list`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "data": [
          {
            "name": "label",
            "key": "value"
          }
        ]
      })
    )
  }),
  rest.post(`${process.env.REACT_APP_API_BASE_URL}/dom-list/get-screenshot`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Dom successfully added to screenshot queue',
        dom_uuid: randomUUID()
      })
    )
  }),
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/project-list`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "total": 6,
        "limit": 1000,
        "skip": 0,
        "data": [{
          "id": "3",
          "name": "IQIES",
          "createdAt": "2022-09-12T11:34:12.905Z",
          "updatedAt": "2022-09-12T11:34:12.905Z",
          "recordings_lists": [
            {
              "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
              "recording_name": "Recording 1",
              "id": 3,
              "createdAt": "2022-09-23T05:57:44.891Z",
              "updatedAt": "2022-09-23T05:57:44.891Z"
            }
          ],
          "workflow_lists": [{
            "workflow_id": "115",
            "id": "3",
            "workflow_name": "Flow 70",
            "recording_id": "a7f5834e-0540-44a0-a5db-a7fcb9bfd027",
            "workflow_entry_url": "",
            "allow_loop": false,
            "createdAt": "2022-11-30T10:17:11.979Z",
            "updatedAt": "2022-11-30T10:17:11.979Z"
          }]
        }]
      })
    )
  }),
  rest.post(`${process.env.REACT_APP_API_BASE_URL}/project-list`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        "id": "1",
        "name": "New Project 2",
        "updatedAt": "2023-01-10T11:59:16.198Z",
        "createdAt": "2023-01-10T11:59:16.198Z"
      })
    )
  }),
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/project-list/1`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "id": "1",
        "name": "IQIES",
        "createdAt": "2022-09-12T11:34:12.905Z",
        "updatedAt": "2022-09-12T11:34:12.905Z",
        "recordings_lists": [{
          "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
          "recording_name": "Recording 1",
          "id": 3,
          "createdAt": "2022-09-23T05:57:44.891Z",
          "updatedAt": "2022-09-23T05:57:44.891Z"
        }],
        "workflow_lists": [{
          "workflow_id": "13",
          "id": "3",
          "workflow_name": "Flow 0",
          "recording_id": "4ae275b6-575c-4fb8-9a18-53041df26b7e",
          "workflow_entry_url": "",
          "allow_loop": null,
          "createdAt": "2022-09-13T11:22:42.809Z",
          "updatedAt": "2022-09-13T11:22:42.809Z"
        }]
      })
    )
  }),
  rest.patch(`${process.env.REACT_APP_API_BASE_URL}/project-list/1`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "id": "1",
        "name": "Project name - edited",
        "createdAt": "2023-01-10T12:15:57.502Z",
        "updatedAt": "2023-01-11T11:17:24.747Z"
      })
    )
  }),
  rest.patch(`${process.env.REACT_APP_API_BASE_URL}/recordings-list/c965447a-da0a-4afc-996a-e0c426d93fd8`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
        "recording_name": "Recording name - edited",
        "id": 7,
        "createdAt": "2022-10-17T10:18:26.847Z",
        "updatedAt": "2023-01-11T11:35:27.633Z"
      })
    )
  }),
  rest.delete(`${process.env.REACT_APP_API_BASE_URL}/recordings-list/c965447a-da0a-4afc-996a-e0c426d93fd8`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
        "recording_name": "Recording name - edited",
        "id": 7,
        "createdAt": "2022-10-17T10:18:26.847Z",
        "updatedAt": "2023-01-11T11:35:27.633Z"
      })
    )
  }),
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/workflow-list/13`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "workflow_id": "13",
        "id": "1",
        "workflow_name": "Flow 01",
        "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
        "workflow_entry_url": "",
        "allow_loop": true,
        "createdAt": "2023-01-03T07:41:30.085Z",
        "updatedAt": "2023-01-03T07:41:30.085Z",
        "workflow_sequences": [
          {
            "workflow_sequence_id": "1",
            "workflow_id": "13",
            "dom_uuid": "4904e4dc-a6de-48b4-bcac-388c8788b042",
            "dom_position": 9,
            "wait_type": "EVENT",
            "delay_interval": "100",
            "event_id": "7740",
            "api_key": null,
            "download_key": null,
            "upload_enabled": null,
            "createdAt": "2023-01-03T07:41:30.165Z",
            "updatedAt": "2023-01-03T07:41:30.165Z"
          }
        ]
      })
    )
  }),
  rest.patch(`${process.env.REACT_APP_API_BASE_URL}/workflow-list/workflow-sequence/13`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "workflow_id": "13",
        "id": "1",
        "workflow_name": "Flow 01",
        "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
        "workflow_entry_url": "",
        "allow_loop": true,
        "createdAt": "2023-01-03T07:41:30.085Z",
        "updatedAt": "2023-01-03T07:41:30.085Z",
        "workflow_sequences": [
          {
            "workflow_sequence_id": "1",
            "workflow_id": "13",
            "dom_uuid": "4904e4dc-a6de-48b4-bcac-388c8788b042",
            "dom_position": 9,
            "wait_type": "EVENT",
            "delay_interval": "100",
            "event_id": "7740",
            "api_key": null,
            "download_key": null,
            "upload_enabled": null,
            "createdAt": "2023-01-03T07:41:30.165Z",
            "updatedAt": "2023-01-03T07:41:30.165Z"
          }
        ]
      })
    )
  }),
  rest.patch(`${process.env.REACT_APP_API_BASE_URL}/workflow-list/13`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "workflow_id": "13",
        "id": "1",
        "workflow_name": "Flow name - edited",
        "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
        "workflow_entry_url": "",
        "allow_loop": null,
        "createdAt": "2022-11-14T14:20:28.080Z",
        "updatedAt": "2023-01-11T11:48:53.690Z"
      })
    )
  }),
  rest.delete(`${process.env.REACT_APP_API_BASE_URL}/workflow-list/13`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "workflow_id": "13",
        "id": "1",
        "workflow_name": "Flow name - edited",
        "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
        "workflow_entry_url": "",
        "allow_loop": null,
        "createdAt": "2022-11-14T14:20:28.080Z",
        "updatedAt": "2023-01-11T11:48:53.690Z"
      })
    )
  }),
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/recordings-list/c965447a-da0a-4afc-996a-e0c426d93fd8`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
        "recording_name": "Recording 200",
        "id": 1,
        "createdAt": "2023-01-05T21:15:19.776Z",
        "updatedAt": "2023-01-05T21:15:19.776Z"
      })
    )
  }),
  rest.get(`${process.env.REACT_APP_API_BASE_URL}/recordings-list/dom-list/c965447a-da0a-4afc-996a-e0c426d93fd8`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        "total": 33,
        "limit": 50,
        "skip": 0,
        "data": [{
          "recording_id": "c965447a-da0a-4afc-996a-e0c426d93fd8",
          "dom_path": "https://dpl-cdn.e5.ai/dev/web/4904e4dc-a6de-48b4-bcac-388c8788b042",
          "dom_time_stamp": "2023-01-05T21:15:19.875Z",
          "dom_uuid": "4904e4dc-a6de-48b4-bcac-388c8788b042",
          "height": 889,
          "width": 1912,
          "dom_thumbnail_path": "https://dpl-cdn.e5.ai/dev/web/biYkjOUPDjPEJJKCErCQyIaLrwSdKERvBc",
          "createdAt": "2023-01-05T21:15:20.279Z",
          "updatedAt": "2023-01-05T21:16:00.257Z",
          "events_lists": [
            {
              "eventId": "7740",
              "recordingId": "c965447a-da0a-4afc-996a-e0c426d93fd8",
              "domId": null,
              "eventType": "pointerdown",
              "eventTargetHash": "1664521185",
              "eventTargetPath": "[[{\"nodeName\":\"class\",\"nodeValue\":\"input_error form_input\"},{\"nodeName\":\"placeholder\",\"nodeValue\":\"Username\"},{\"nodeName\":\"type\",\"nodeValue\":\"text\"},{\"nodeName\":\"id\",\"nodeValue\":\"user-name\"},{\"nodeName\":\"name\",\"nodeValue\":\"user-name\"},{\"nodeName\":\"autocapitalize\",\"nodeValue\":\"none\"},{\"nodeName\":\"value\",\"nodeValue\":\"\"}],[{\"nodeName\":\"class\",\"nodeValue\":\"form_group\"}],[],[{\"nodeName\":\"class\",\"nodeValue\":\"login-box\"}],[{\"nodeName\":\"id\",\"nodeValue\":\"login_button_container\"},{\"nodeName\":\"class\",\"nodeValue\":\"form_column\"}],[{\"nodeName\":\"class\",\"nodeValue\":\"login_wrapper-inner\"}],[{\"nodeName\":\"class\",\"nodeValue\":\"login_wrapper\"}],[],[{\"nodeName\":\"id\",\"nodeValue\":\"root\"}],[],[{\"nodeName\":\"lang\",\"nodeValue\":\"en\"}],[],[]]",
              "eventTimeStamp": "2023-01-05T21:15:21.720Z",
              "dom_uuid": "4904e4dc-a6de-48b4-bcac-388c8788b042",
              "top": 167,
              "left": 587.5,
              "height": 43,
              "width": 345.59375,
              "eventName": "Click Event (Pointer)",
              "elementXPath": "id(\"user-name\")",
              "createdAt": "2023-01-05T21:15:21.802Z",
              "updatedAt": "2023-01-05T21:15:21.802Z"
            },
            {
              "eventId": "7741",
              "recordingId": "c965447a-da0a-4afc-996a-e0c426d93fd8",
              "domId": null,
              "eventType": "mouseup",
              "eventTargetHash": "-689777470",
              "eventTargetPath": "[[{\"nodeName\":\"class\",\"nodeValue\":\"input_error form_input\"},{\"nodeName\":\"placeholder\",\"nodeValue\":\"Username\"},{\"nodeName\":\"type\",\"nodeValue\":\"text\"},{\"nodeName\":\"id\",\"nodeValue\":\"user-name\"},{\"nodeName\":\"name\",\"nodeValue\":\"user-name\"},{\"nodeName\":\"autocapitalize\",\"nodeValue\":\"none\"},{\"nodeName\":\"value\",\"nodeValue\":\"\"}],[{\"nodeName\":\"class\",\"nodeValue\":\"form_group\"}],[],[{\"nodeName\":\"class\",\"nodeValue\":\"login-box\"}],[{\"nodeName\":\"id\",\"nodeValue\":\"login_button_container\"},{\"nodeName\":\"class\",\"nodeValue\":\"form_column\"}],[{\"nodeName\":\"class\",\"nodeValue\":\"login_wrapper-inner\"}],[{\"nodeName\":\"class\",\"nodeValue\":\"login_wrapper\"}],[],[{\"nodeName\":\"id\",\"nodeValue\":\"root\"}],[],[{\"nodeName\":\"lang\",\"nodeValue\":\"en\"}],[],[]]",
              "eventTimeStamp": "2023-01-05T21:15:21.934Z",
              "dom_uuid": "4904e4dc-a6de-48b4-bcac-388c8788b042",
              "top": 167,
              "left": 587.5,
              "height": 43,
              "width": 345.59375,
              "eventName": "Click Event (Mouse)",
              "elementXPath": "id(\"user-name\")",
              "createdAt": "2023-01-05T21:15:22.000Z",
              "updatedAt": "2023-01-05T21:15:22.000Z"
            },
            {
              "eventId": "7742",
              "recordingId": "c965447a-da0a-4afc-996a-e0c426d93fd8",
              "domId": null,
              "eventType": "keypress",
              "eventTargetHash": "1750767512",
              "eventTargetPath": "[[{\"nodeName\":\"class\",\"nodeValue\":\"input_error form_input\"},{\"nodeName\":\"placeholder\",\"nodeValue\":\"Username\"},{\"nodeName\":\"type\",\"nodeValue\":\"text\"},{\"nodeName\":\"id\",\"nodeValue\":\"user-name\"},{\"nodeName\":\"name\",\"nodeValue\":\"user-name\"},{\"nodeName\":\"autocapitalize\",\"nodeValue\":\"none\"},{\"nodeName\":\"value\",\"nodeValue\":\"\"}],[{\"nodeName\":\"class\",\"nodeValue\":\"form_group\"}],[],[{\"nodeName\":\"class\",\"nodeValue\":\"login-box\"}],[{\"nodeName\":\"id\",\"nodeValue\":\"login_button_container\"},{\"nodeName\":\"class\",\"nodeValue\":\"form_column\"}],[{\"nodeName\":\"class\",\"nodeValue\":\"login_wrapper-inner\"}],[{\"nodeName\":\"class\",\"nodeValue\":\"login_wrapper\"}],[],[{\"nodeName\":\"id\",\"nodeValue\":\"root\"}],[],[{\"nodeName\":\"lang\",\"nodeValue\":\"en\"}],[],[]]",
              "eventTimeStamp": "2023-01-05T21:15:24.540Z",
              "dom_uuid": "4904e4dc-a6de-48b4-bcac-388c8788b042",
              "top": 167,
              "left": 587.5,
              "height": 43,
              "width": 345.59375,
              "eventName": "Key Event (p)",
              "elementXPath": "id(\"user-name\")",
              "createdAt": "2023-01-05T21:15:24.607Z",
              "updatedAt": "2023-01-05T21:15:24.607Z"
            }
          ]
        }],
        "recordingType": 0,
        "page": 1
      })
    )
  }),
  rest.post(`${process.env.REACT_APP_API_BASE_URL}/workflow-list/workflow-sequence`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        "workflow_id": "168",
        "id": "7",
        "workflow_name": "Flow 46",
        "recording_id": "e331e419-dae9-4aa1-82a8-706c19af362e",
        "workflow_entry_url": "",
        "allow_loop": true,
        "updatedAt": "2023-01-11T13:07:33.412Z",
        "createdAt": "2023-01-11T13:07:33.412Z",
        "workflow_sequences": [
          {
            "workflow_sequence_id": "3499",
            "dom_uuid": "4904e4dc-a6de-48b4-bcac-388c8788b042",
            "dom_position": 1,
            "wait_type": "EVENT",
            "delay_interval": "100",
            "event_id": "7742",
            "workflow_id": "168",
            "createdAt": "2023-01-11T13:07:33.551Z",
            "updatedAt": "2023-01-11T13:07:33.551Z",
            "api_key": null,
            "download_key": null,
            "upload_enabled": null
          }
        ]
      })
    )
  })
];
