import { Assertion, TestCase, TestCaseFlowSequence } from "../declarations/interface";
import BaseService from "./baseService";

class TestCaseService extends BaseService {
  constructor() {
    super("/test-case");
  }

  async getByProjectId(projectId: string) {
    return this.get("", { projectId })
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

  async duplicateTestCase(id: string) {
    return this.post("/duplicate", {
      testCaseId: id,
    });
  }

  async createTestCaseData(payload: { testCase: TestCase, sequences: TestCaseFlowSequence[], assertions: Assertion[], tags: string[] }) {
    return this.post("/create", {
      testCase: { projectId: payload.testCase.projectId, name: payload.testCase.name },
      sequences: payload.sequences,
      assertions: payload.assertions,
      tags: payload.tags
    });
  }

  async updateTestCaseData(payload: {
    testCase: TestCase, sequences: {
      updatedSequences: TestCaseFlowSequence[], newSequences: TestCaseFlowSequence[], removedSequences: string[]
    }, assertions: Assertion[], tags: {
      deletedTags: (string | undefined)[] | undefined;
      newTags: {
        tagId: string;
        testCaseId: string | undefined;
      }[] | undefined;
    }
  }) {
    return this.post("/update", payload);
  }

  async deleteTestCase(id: string) {
    return this.remove(`/${id}`);
  }

  async getTestCaseById(id: string) {
    return this.get(`/${id}`);
  }

  async getTestCaseHistoryById(id: string) {
    return this.get(`/history/${id}`);
  }
}

export default new TestCaseService();