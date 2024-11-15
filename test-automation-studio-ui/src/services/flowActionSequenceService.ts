import { FlowActionSequence } from "../declarations/interface";
import BaseService from "./baseService";

class FlowActionSequenceService extends BaseService {
  constructor() {
    super("/flow-action-sequence");
  }

  async createSequences(sequences: FlowActionSequence[]) {
    return this.post("/create-sequences", sequences);
  }

  async updateSequences(payload: {
    updatedSequences: FlowActionSequence[], newSequences: FlowActionSequence[], removedSequences: string[]
  }) {
    return this.post("/update-sequences", payload);
  }
}

export default new FlowActionSequenceService();