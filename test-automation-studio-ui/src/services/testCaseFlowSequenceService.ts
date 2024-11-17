import { TestCaseFlowSequence } from "../declarations/interface";
import BaseService from "./baseService";

class TestCaseFlowSequenceService extends BaseService {
  constructor() {
    super("/test-case-flow-sequence");
  }
}

export default new TestCaseFlowSequenceService();