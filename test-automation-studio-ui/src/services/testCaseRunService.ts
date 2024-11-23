import { Assertion, TestCase, TestCaseFlowSequence, TestCaseRun } from "../declarations/interface";
import BaseService from "./baseService";

class TestCaseService extends BaseService {
  constructor() {
    super("/test-case-run");
  }

  async getTestCaseRunById(id: string) {
    return this.get(`/${id}`);
  }

  async executeRun(id: string) {
    return this.post('/execute', {
      testCaseId: id
    })
  }
}

export default new TestCaseService();