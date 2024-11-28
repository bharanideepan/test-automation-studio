import BaseService from "./baseService";

class TestSuiteRunService extends BaseService {
  constructor() {
    super("/test-suite-run");
  }

  async getTestSuiteRunById(id: string) {
    return this.get(`/${id}`);
  }

  async executeRun(id: string) {
    return this.post('/execute', { testSuiteId: id })
  }
}

export default new TestSuiteRunService();