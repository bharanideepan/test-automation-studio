import { Action } from "../declarations/interface";
import BaseService from "./baseService";

class ActionService extends BaseService {
  constructor() {
    super("/action");
  }

  async updateAction(action: Action) {
    return this.patch(`/${action.id}`, action);
  }

  async createAction(action: Action) {
    const newAction = {...action} as any;
    delete newAction.id;
    return this.post("", newAction);
  }

  async deleteAction(id: string) {
    return this.remove(`/${id}`);
  }
}

export default new ActionService();