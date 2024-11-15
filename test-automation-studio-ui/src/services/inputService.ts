import { Input } from "../declarations/interface";
import BaseService from "./baseService";
class InputService extends BaseService {
  constructor() {
    super("/input");
  }

  async updateInput(input: Input) {
    return this.patch(`/${input.id}`, input);
  }

  async setDefaultInput(input: Input) {
    return this.post(`/set-default`, input);
  }

  async createInput(input: Input) {
    const newInput = {...input} as any;
    delete newInput.id;
    return this.post("", newInput);
  }

  async deleteInput(id: string) {
    return this.remove(`/${id}`);
  }
}

export default new InputService();