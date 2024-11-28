import { testSuite } from "../declarations/interface";
import BaseService from "./baseService";

class TestSuiteService extends BaseService {
  constructor() {
    super("/test-suite");
  }

  async getByProjectId(projectId: string) {
    return this.get("", { projectId })
  }

  async duplicatetestSuite(id: string) {
    return this.post("/duplicate", {
      testSuiteId: id,
    });
  }

  async createtestSuiteData(payload: { testSuite: testSuite, tags: string[] }) {
    return this.post("/create", {
      testSuite: { projectId: payload.testSuite.projectId, name: payload.testSuite.name },
      tags: payload.tags
    });
  }

  async updatetestSuiteData(payload: {
    testSuite: testSuite,
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

  async deletetestSuite(id: string) {
    return this.remove(`/${id}`);
  }

  async gettestSuiteById(id: string) {
    return this.get(`/${id}`);
  }
}

export default new TestSuiteService();