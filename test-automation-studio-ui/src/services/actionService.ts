import { Action } from "../declarations/interface";
import BaseService from "./baseService";

class ActionService extends BaseService {
  constructor() {
    super("/action");
  }

  async updateAction(action: Action) {
    const newAction = { ...action } as any;
    if (newAction.selectorId.length <= 0) {
      delete newAction.selectorId;
    }
    return this.patch(`/${action.id}`, newAction);
  }

  async createAction(action: Action) {
    const newAction = { ...action } as any;
    delete newAction.id;
    if (newAction.selectorId.length <= 0) {
      delete newAction.selectorId;
    }
    return this.post("", newAction);
  }

  async deleteAction(id: string) {
    return this.remove(`/${id}`);
  }
}

export default new ActionService();