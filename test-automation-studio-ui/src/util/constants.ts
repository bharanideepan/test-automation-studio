import { Action, Flow, Input, TestCase } from "../declarations/interface";

export default {
  dateDisplayFormat: "DD MMM, YYYY (HH:mm A)"
}

export const ACTION_TYPES = [
  { label: "Launch Browser", value: "LAUNCH_BROWSER" },
  { label: "Click", value: "CLICK" },
  { label: "Double Click", value: "DOUBLE_CLICK" },
  { label: "Get dropdown value", value: "GET_DROPDOWN_VALUE" },
  { label: "Set dropdown value", value: "SET_DROPDOWN_VALUE" },
  { label: "Type text", value: "TYPE_TEXT" },
  { label: "Get text", value: "GET_TEXT" },
  { label: "Get Checkbox value", value: "GET_CHECKBOX_VALUE" },
  { label: "Set Checkbox value", value: "SET_CHECKBOX_VALUE" },
  { label: "Get Radio value", value: "GET_RADIO_VALUE" },
  { label: "Set Radio value", value: "SET_RADIO_VALUE" },
  { label: "Is element visible", value: "IS_ELEMENT_VISIBLE" },
];

export const DEFAULT_ACTION: Action = {
  id: "",
  projectId: "",
  name: "",
  type: "",
  xpath: "",
  valueRegex: "",
  inputs: [],
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