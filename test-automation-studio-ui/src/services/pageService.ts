import { Page } from "../declarations/interface";
import BaseService from "./baseService";

class PageService extends BaseService {
  constructor() {
    super("/page");
  }

  async getByProjectId(projectId: string) {
    return this.get(``, {
      projectId
    });
  }

  async createPage(page: Page) {
    const newPage = { ...page } as any;
    delete newPage.id;
    return this.post("", newPage);
  }

  async updatePage(page: Page) {
    return this.patch(`/${page.id}`, page);
  }
}

export default new PageService();