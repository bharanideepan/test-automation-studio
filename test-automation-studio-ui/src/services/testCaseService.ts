import { TestCase } from "../declarations/interface";
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

  async deleteTestCase(id: string) {
    return this.remove(`/${id}`);
  }

  async getTestCaseById(id: string) {
    return this.get(`/${id}`);
  }
}

export default new TestCaseService();