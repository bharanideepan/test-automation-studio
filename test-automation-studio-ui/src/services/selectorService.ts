import { Selector } from "../declarations/interface";
import BaseService from "./baseService";

class SelectorService extends BaseService {
  constructor() {
    super("/selector");
  }

  async createSelector(selector: Selector) {
    const newSelector = { ...selector } as any;
    delete newSelector.id;
    return this.post("", newSelector);
  }

  async updateSelector(selector: Selector) {
    return this.patch(`/${selector.id}`, selector);
  }
}

export default new SelectorService();