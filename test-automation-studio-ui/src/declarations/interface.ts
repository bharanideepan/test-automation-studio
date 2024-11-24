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
  assertions?: Assertion[];
  testCaseRuns?: TestCaseRun[];
}

export interface Assertion {
  id?: string;
  skip: boolean;
  operator?: string;
  source?: string;
  target?: string;
  testCaseId?: string;
  customTargetValue?: string;
  useCustomTargetValue?: boolean;
  errorMessage?: string;
  isRemoved?: boolean;
  unRestorable?: boolean;
}

export interface Action {
  id: string;
  name: string;
  type: string;
  valueRegex?: string;
  projectId: string;
  inputs?: Input[];
  selector?: Selector;
  selectorId: string;
}

export interface Page {
  id: string;
  name: string;
  selectors?: Selector[];
  projectId: String;
}

export interface Selector {
  id: string;
  name: string;
  xpath: string;
  pageId: string;
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
  testCaseFlowSequenceTempId?: string;
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

export interface TestCaseRun {
  id: string;
  status: string;
  errorMessage?: string;
  createdAt: string;
  testCaseId: string;
  testCaseFlowSequenceHistories?: TestCaseFlowSequenceHistory[]
}

export interface TestCaseFlowSequenceHistory {
  id: string;
  status: string;
  errorMessage?: string;
  createdAt: string;
  testCaseFlowSequence?: TestCaseFlowSequence;
  flowActionSequenceHistories?: FlowActionSequenceHistory[];
}

export interface FlowActionSequenceHistory {
  actionName: string;
  actionType: string;
  actionXpath: string;
  createdAt: string;
  errorMessage: string;
  assertionMessage?: string;
  id: string;
  inputValue: string;
  status: string;
  updatedAt: string;
}