export interface Project {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  flows: Flow[];
  testCases: TestCase[];
  actions: Action[];
}

export interface Flow {
  id: string;
  name: string;
  projectId: string;
  flowActionSequences?: FlowActionSequence[];
}

export interface TestCase {
  id: string;
  name: string;
  projectId: string;
  testCaseFlowSequences?: TestCaseFlowSequence[];
}

export interface Action {
  id: string;
  name: string;
  type: string;
  xpath: string;
  valueRegex?: string;
  projectId: string;
  inputs?: Input[];
}

export interface FlowActionSequence {
  id?: string;
  actionId: string;
  flowId?: string;
  order: number;
  action: Action;
  isRemoved?: boolean;
  testCaseFlowSequenceActionInput?: TestCaseFlowSequenceActionInput;
}

export interface TestCaseFlowSequence {
  id?: string;
  testCaseId?: string;
  flowId: string;
  order: number;
  flow: Flow;
  isRemoved?: boolean;
}

export interface TestCaseFlowSequenceActionInput {
  id?: string;
  flowActionSequenceId: string;
  inputId: string;
  testCaseFlowSequenceId: string;
  defaultInput: boolean;
  skip: boolean;
}

export interface Input {
  id: string;
  name: string;
  actionId: string;
  value?: string;
  waitAfterAction?: number;
  isDefault: boolean;
}

export interface LabelValue {
  label: string;
  value: string;
}
