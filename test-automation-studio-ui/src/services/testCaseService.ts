import { Assertion, TestCase, TestCaseFlowSequence } from "../declarations/interface";
import BaseService from "./baseService";

class TestCaseService extends BaseService {
  constructor() {
    super("/test-case");
  }

  async updateTestCase(testCase: TestCase) {
    return this.patch(`/${testCase.id}`, testCase);
  }

  async createTestCase(testCase: TestCase) {
    return this.post("", {
      projectId: testCase.projectId,
      name: testCase.name,
    });
  }

  async createTestCaseData(payload: {testCase: TestCase, sequences: TestCaseFlowSequence[], assertions: Assertion[]}) {
    return this.post("/create", {
      testCase: {projectId: payload.testCase.projectId, name: payload.testCase.name},
      sequences: payload.sequences,
      assertions: payload.assertions
    });
  }

  async updateTestCaseData(payload: {testCase: TestCase, sequences:{
    updatedSequences: TestCaseFlowSequence[], newSequences: TestCaseFlowSequence[], removedSequences: string[]
  }}) {
    return this.post("/update", payload);
  }

  async deleteTestCase(id: string) {
    return this.remove(`/${id}`);
  }

  async getTestCaseById(id: string) {
    return this.get(`/${id}`);
  }
}

export default new TestCaseService();