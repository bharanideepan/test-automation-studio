import { Action, Assertion, Flow, FlowActionSequence, Input, Page, Selector, TestCase, TestCaseFlowSequence } from "../declarations/interface";

export default {
  dateDisplayFormat: "DD MMM, YYYY (HH:mm:ss A)"
}

export const OPERATOR_TYPES = [
  { label: "Should be equal to", value: "SHOULD_BE_EQUAL_TO" },
  { label: "Should not be Equal to", value: "SHOULD_NOT_BE_EQUAL_TO" },
  { label: "Contains", value: "CONTAINS" },
  { label: "Target Contains Source", value: "TARGET_CONTAINS_SOURCE" },
  { label: "Should not Contain", value: "SHOULD_NOT_CONTAIN" },
  { label: "Target Should not Contain Source", value: "TARGET_SHOULD_NOT_CONTAIN_SOURCE" },
  // {label: "List should contain", value: "LIST_SHOULD_CONTAIN"},
  // {label: "List should not contain", value: "LIST_SHOULD_NOT_CONTAIN"},
  // {label: "List count should be equal to", value: "LIST_COUNT_SHOULD_BE_EQUAL_TO"},
  // {label: "List count should be greater than", value: "LIST_COUNT_SHOULD_BE_GREATER_THAN"},
  // {label: "List count should be less than", value: "LIST_COUNT_SHOULD_BE_LESS_THAN"},
]

export const ACTION_TYPES = [
  { label: "Launch Browser", value: "LAUNCH_BROWSER" },
  // { label: "New Page", value: "NEW_PAGE" },
  { label: "Click", value: "CLICK" },
  { label: "Double Click", value: "DOUBLE_CLICK" },
  { label: "Get dropdown value", value: "GET_DROPDOWN_VALUE" },
  { label: "Set dropdown value", value: "SET_DROPDOWN_VALUE" },
  { label: "Type text", value: "TYPE_TEXT" },
  { label: "Get textbox value", value: "GET_TEXTBOX_VALUE" },
  { label: "Get Checkbox value", value: "GET_CHECKBOX_VALUE" },
  { label: "Set Checkbox value", value: "SET_CHECKBOX_VALUE" },
  { label: "Get Radio value", value: "GET_RADIO_VALUE" },
  { label: "Set Radio value", value: "SET_RADIO_VALUE" },
  { label: "Is element visible", value: "IS_ELEMENT_VISIBLE" },
  { label: "Get text", value: "GET_TEXT" },
];

export const INPUT_ACTION_TYPES = [
  "SET_DROPDOWN_VALUE",
  "TYPE_TEXT",
  "SET_CHECKBOX_VALUE",
  "SET_RADIO_VALUE",
]

export const OUTPUT_ACTION_TYPES = [
  "GET_DROPDOWN_VALUE",
  "GET_TEXTBOX_VALUE",
  "GET_CHECKBOX_VALUE",
  "GET_RADIO_VALUE",
  "IS_ELEMENT_VISIBLE",
  "GET_TEXT"
]

export const BOOLEAN_ACITON_TYPES = [
  "GET_CHECKBOX_VALUE",
  "GET_RADIO_VALUE",
  "IS_ELEMENT_VISIBLE",
]

export const DEFAULT_SELECTOR: Selector = {
  id: "",
  pageId: "",
  name: "",
  xpath: "",
  pageName: ""
};

export const DEFAULT_PAGE: Page = {
  id: "",
  projectId: "",
  name: "",
};

export const DEFAULT_TAG: Page = {
  id: "",
  projectId: "",
  name: "",
};

export const DEFAULT_ACTION: Action = {
  id: "",
  projectId: "",
  name: "",
  type: "",
  valueRegex: "",
  inputs: [],
  selectorId: ""
};

export const DEFAULT_INPUT: Input = {
  id: "",
  actionId: "",
  name: "",
  value: "",
  waitAfterAction: 0,
  isDefault: false
};

export const DEFAULT_TEST_CASE: TestCase = {
  id: "",
  projectId: "",
  name: ""
};

export const DEFAULT_FLOW: Flow = {
  id: "",
  projectId: "",
  name: ""
};

export const DEFAULT_ASSERTION: Assertion = {
  skip: false,
  source: "",
  target: "",
  operator: "",
  useCustomTargetValue: false,
  customTargetValue: "",
  isRemoved: false,
  errorMessage: ""
}

export const GET_ASSERTION_OPTIONS_FORMATTED = (selectedFlowSequences?: TestCaseFlowSequence[], excludeRemovedSequences?: boolean, forSource?: boolean) => {
  const options = selectedFlowSequences?.filter((flowSequence: TestCaseFlowSequence) => {
    if (excludeRemovedSequences) {
      if (flowSequence.isRemoved) {
        return false;
      }
    }
    return true;
  }).map((flowSequence: TestCaseFlowSequence) => {
    const arr: {
      testCaseFlowSequenceId?: string;
      testCaseFlowSequenceTempId?: string;
      flowActionSequenceId: string;
      actionName: string;
      actionType: string;
    }[] = [];
    flowSequence.flow.flowActionSequences?.map((actionSequence: FlowActionSequence) => {
      const flowActionSequenceId = actionSequence.id ?? "";
      if (forSource) {
        if (OUTPUT_ACTION_TYPES.includes(actionSequence.action.type)) {
          arr.push({
            ...(flowSequence.id && { testCaseFlowSequenceId: flowSequence.id }),
            ...(flowSequence.testCaseFlowSequenceTempId && { testCaseFlowSequenceTempId: flowSequence.testCaseFlowSequenceTempId }),
            flowActionSequenceId,
            actionName: actionSequence.action.name,
            actionType: actionSequence.action.type
          });
        }
      } else {
        if (OUTPUT_ACTION_TYPES.includes(actionSequence.action.type) || INPUT_ACTION_TYPES.includes(actionSequence.action.type)) {
          arr.push({
            ...(flowSequence.id && { testCaseFlowSequenceId: flowSequence.id }),
            ...(flowSequence.testCaseFlowSequenceTempId && { testCaseFlowSequenceTempId: flowSequence.testCaseFlowSequenceTempId }),
            flowActionSequenceId,
            actionName: actionSequence.action.name,
            actionType: actionSequence.action.type
          });
        }
      }
    })
    return arr;
  }).flat().map((x) => {
    const value = x.testCaseFlowSequenceId
      ? `testCaseFlowSequenceId:${x.testCaseFlowSequenceId}::flowActionSequenceId:${x.flowActionSequenceId}`
      : `testCaseFlowSequenceTempId:${x.testCaseFlowSequenceTempId}::flowActionSequenceId:${x.flowActionSequenceId}`;
    return {
      label: x.actionName, value, type: x.actionType
    }
  }) ?? []
  return options;
}