import { Tag } from "../declarations/interface";
import BaseService from "./baseService";

class TagService extends BaseService {
  constructor() {
    super("/tag");
  }

  async getByProjectId(projectId: string) {
    return this.get("", { projectId })
  }

  async createTag(tag: Tag) {
    return this.post("", {
      projectId: tag.projectId,
      name: tag.name,
    });
  }

  async updateTag(tag: Tag) {
    return this.patch(`/${tag.id}`, tag);
  }
}

export default new TagService();