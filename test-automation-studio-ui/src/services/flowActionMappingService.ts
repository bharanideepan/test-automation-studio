import { FlowActionMapping } from "../declarations/interface";
import BaseService from "./baseService";

class FlowActionMappingService extends BaseService {
  constructor() {
    super("/flow-action-mapping");
  }

  async createFlowActionMappings(mappings: FlowActionMapping[]) {
    return this.post("/create-mappings", mappings);
  }

  async updateFlowActionMappings(payload: {
    updatedFlowActionMappings: FlowActionMapping[], newFlowActionMappings: FlowActionMapping[], removedFlowActionMappings: string[]
  }) {
    return this.post("/update-mappings", payload);
  }
}

export default new FlowActionMappingService();