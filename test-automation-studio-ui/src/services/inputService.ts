import { Input } from "../declarations/interface";
import BaseService from "./baseService";
class InputService extends BaseService {
  constructor() {
    super("/input");
  }

  async updateInput(input: Input) {
    return this.patch(`/${input.id}`, input);
  }

  async createInput(input: Input) {
    return this.post("", {
      name: input.name,
      actionId: input.actionId,
      type:  input.type,
      xpath: input.xpath, 
      value: input.value, 
    });
  }

  async deleteInput(id: string) {
    return this.remove(`/${id}`);
  }
}

export default new InputService();