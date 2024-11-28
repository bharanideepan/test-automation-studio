import { TestSuite } from "../declarations/interface";
import BaseService from "./baseService";

class TestSuiteService extends BaseService {
  constructor() {
    super("/test-suite");
  }

  async getByProjectId(projectId: string) {
    return this.get("", { projectId })
  }

  async duplicateTestSuite(id: string) {
    return this.post("/duplicate", {
      testSuiteId: id,
    });
  }

  async createTestSuiteData(payload: { testSuite: TestSuite, tags: string[] }) {
    return this.post("/create", {
      testSuite: { projectId: payload.testSuite.projectId, name: payload.testSuite.name },
      tags: payload.tags
    });
  }

  async updateTestSuiteData(payload: {
    testSuite: TestSuite,
    tags: {
      deletedTags: (string | undefined)[] | undefined;
      newTags: {
        tagId: string;
        testSuiteId: string | undefined;
      }[] | undefined;
    }
  }) {
    return this.post("/update", payload);
  }

  async deleteTestSuite(id: string) {
    return this.remove(`/${id}`);
  }

  async getTestSuiteById(id: string) {
    return this.get(`/${id}`);
  }

  async getTestSuiteHistoryById(id: string) {
    return this.get(`/history/${id}`);
  }
}

export default new TestSuiteService();