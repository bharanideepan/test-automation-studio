import { Application } from "../declarations";
import flowService from "./flow/flow.service";
import actionService from "./action/action.service";
import inputService from "./input/input.service";
import projectService from "./project/project.service";
import testCaseService from "./test-case/test-case.service";
import testCaseFlowSequenceActionInput from "./test-case-flow-sequence-action-input/test-case-flow-sequence-action-input.service";
import testCaseFlowSequence from "./test-case-flow-sequence/test-case-flow-sequence.service";
import flowActionSequence from "./flow-action-sequence/flow-action-sequence.service";
import assertionSequence from "./assertion/assertion.service";
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(actionService);
  app.configure(inputService);
  app.configure(flowService);
  app.configure(projectService);
  app.configure(testCaseService);
  app.configure(testCaseFlowSequenceActionInput);
  app.configure(testCaseFlowSequence);
  app.configure(flowActionSequence);
  app.configure(assertionSequence);
}
