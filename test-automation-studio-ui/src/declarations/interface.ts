export interface Project {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  flows: Flow[];
  test_cases: TestCase[];
  actions: Action[];
}

export interface Flow {
  id: string;
  name: string;
  projectId: string;
  actions?: Action[];
}

export interface TestCase {
  id: string;
  name: string;
  projectId: string;
  flows?: Flow[];
}

export interface Action {
  id: string;
  name: string;
  projectId: string;
  inputs?: Input[];
  flow_action_mapping?: FlowActionMapping;
}

export interface FlowActionMapping {
  id?: string;
  actionId: string;
  flowId: string;
  order: number;
}

export interface Input {
  id: string;
  name: string;
  actionId: string;
  type: string,
  xpath?: string,
  value?: string,
}

export interface Event {
  eventId: string;
  eventType: string;
  top: number;
  left: number;
  height: number;
  width: number;
  eventName?: string;
}
export interface Snapshot {
  dom_uuid: string;
  recording_id: string;
  snapshot_id: string;
  resource_id: string;
  dom_path: string;
  dom_time_stamp: string;
  createdAt: string;
  updatedAt: string;
  events_lists: Event[];
  preview?: string; //
  delay_interval?: string; //
  display_delay_interval?: string; //
  wait_type?: "TIME" | "EVENT" | "REFRESH"; //
  event_id?: string; //
  checked?: boolean; //
  workflow_sequence_id?: string; //used for update functionality
  workflow_id?: string; //used for update functionality
  height: number;
  width: number;
  dom_thumbnail_path: string;
  api_key?: string | null;
  download_key?: string | null;
  upload_enabled?: boolean | null;
}

export interface NewFlow {
  recording_id: string;
  id: string;
  workflow_name: string;
  dom_lists: Snapshot[];
  window_metadata?: any;
  workflow_id?: string;
  workflow_entry_url?: string;
  allow_loop: boolean;
}
//
export interface Recording {
  recording_id: string;
  id: string;
  recording_name: string;
  createdAt: string;
  updatedAt: string;

  name?: string; //TODO: Need to add to the response
}
export interface Scrambling {
  id: string;
  description: string;
  selector: string;
  project_id: string;
}
export interface Workflow {
  workflow_id: string;
  recording_id: string;
  id: string;
  workflow_name: string;
  workflow_entry_url: string;
  allow_loop: boolean;
  createdAt: string;
  updatedAt: string;

  recording_name?: string; //TODO: Need to add to the response
  name?: string; //TODO: Need to add to the response
}

export interface RecordingDetail extends Recording {
  workflow_lists?: any; //TODO: Need to add to the response
}

export interface WindowSnapshot {
  snapshot_id: string;
  resource_id: string;
  createdAt: string;
  updatedAt: string;
  events_lists:
    | {
        eventId: string;
        eventType: string;
      }[]
    | any[];

  delay_interval?: string;
  wait_type?: "TIME" | "EVENT" | "REFRESH"; //
  height: number;
  width: number;
}

export interface DomSnapshot {
  dom_uuid: string;
  recording_id: string;
  dom_path: string;
  dom_time_stamp: string;
  createdAt: string;
  updatedAt: string;
  events_lists: Event[];
  delay_interval?: string;
  wait_type?: "TIME" | "EVENT" | "REFRESH"; //
  height: number;
  width: number;
  dom_thumbnail_path?: string;

  //TODO: Need to add to the response
  // preview?: string;//
  // event_id?: string;//
  // checked?: boolean;//
}

export interface ManagedDomSnapshot extends DomSnapshot {
  new_events?: any[];
}

export interface SelectedDomsObj {
  data: {
    [key: string]: ManagedDomSnapshot;
  };
  orderedDomIds: string[];
}

export interface WorkflowDetail extends Workflow {
  workflow_sequences: WorkflowSequence[]; //TODO: Need to add to the response
}
export interface WorkflowSequence {
  workflow_sequence_id: string;
  workflow_id: string;
  dom_uuid: string | number;
  dom_position: number;
  wait_type: string;
  delay_interval: string;
  event_id: string;
  api_key?: string | null;
  download_key?: string | null;
  upload_enabled?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowPayload {
  workflow_id?: string;
  recording_id: string;
  id: string;
  workflow_name: string;
  workflow_entry_url?: string;
  allow_loop: boolean;
  recording_name?: string;
  name?: string;
  recording_type?: number;
  window_metadatas?: {
    events: any;
    resources: any;
  };
  workflow_sequences: {
    workflow_sequence_id?: string;
    workflow_id?: string;
    dom_uuid: string | number;
    dom_position: number;
    wait_type?: "TIME" | "EVENT" | "REFRESH";
    delay_interval?: string;
    event_id?: string;
    api_key?: string | null;
    download_key?: string | null;
    upload_enabled?: boolean | null;
  }[];
}

export interface SequencePayload {
  workflow_sequence_id?: string;
  workflow_id?: string;
  dom_uuid: string | number;
  dom_position: number;
  wait_type?: "TIME" | "EVENT" | "REFRESH";
  delay_interval?: string;
  event_id?: string;
  api_key?: string | null;
  download_key?: string | null;
  upload_enabled?: boolean | null;
}

export interface UpdateWorkflowPayload {
  workflow_id?: string;
  recording_id: string;
  id: string;
  workflow_name: string;
  workflow_entry_url?: string;
  allow_loop: boolean;
  recording_name?: string;
  recording_type?: number;
  name?: string;
  deletedSequences?: string[];
  updatedSequences?: SequencePayload[];
  newSequences?: SequencePayload[];
}

export interface LabelValue {
  label: string;
  value: string;
}
