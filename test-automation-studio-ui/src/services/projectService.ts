import BaseService from "./baseService";

class ProjectService extends BaseService {
  constructor() {
    super("/project");
  }

  async getAllProjects() {
    return this.get("");
  }

  async getProjectById(id: string) {
    return this.get(`/${id}`);
  }

  async updateProjectName(id: string, name: string) {
    return this.patch(`/${id}`, { name });
  }

  async createProject(name: string) {
    return this.post("", { name });
  }
}

export default new ProjectService();
