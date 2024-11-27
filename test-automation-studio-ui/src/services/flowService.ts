import { Flow } from "../declarations/interface";
import BaseService from "./baseService";

class FlowService extends BaseService {
  constructor() {
    super("/flow");
  }

  async getByProjectId(projectId: string) {
    return this.get("", { projectId })
  }

  async updateFlow(flow: Flow) {
    return this.patch(`/${flow.id}`, flow);
  }

  async createFlow(flow: Flow) {
    return this.post("", {
      projectId: flow.projectId,
      name: flow.name,
    });
  }

  async deleteFlow(id: string) {
    return this.remove(`/${id}`);
  }

  async getFlowById(id: string) {
    return this.get(`/${id}`);
  }

  async duplicateFlow(id: string) {
    return this.post(`/duplicate`, {
      flowId: id
    });
  }
}

export default new FlowService();