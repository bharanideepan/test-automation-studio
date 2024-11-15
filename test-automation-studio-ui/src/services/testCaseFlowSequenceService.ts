import { TestCaseFlowSequence } from "../declarations/interface";
import BaseService from "./baseService";

class TestCaseFlowSequenceService extends BaseService {
  constructor() {
    super("/test-case-flow-sequence");
  }

  async createTestCaseFlowSequences(sequences: TestCaseFlowSequence[]) {
    return this.post("/create-sequences", sequences);
  }

  async updateTestCaseFlowSequences(payload: {
    updatedSequences: TestCaseFlowSequence[], newSequences: TestCaseFlowSequence[], removedSequences: string[]
  }) {
    return this.post("/update-sequences", payload);
  }
}

export default new TestCaseFlowSequenceService();