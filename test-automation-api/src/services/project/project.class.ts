import { Sequelize } from "sequelize";
import { Service, SequelizeServiceOptions } from "feathers-sequelize";
import { Application } from "../../declarations";
import ProjectModel from "../../models/project.model";

export class Project extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async getProjectNameList(data: any) {
    try {
      const Project = ProjectModel(this.app);
      const projects = await Project.findAll({
        attributes: [
          "id",
          "name",
          [
            Sequelize.literal(
              `(SELECT COUNT(*)::integer FROM flow WHERE flow.projectId = project.id)`
            ),
            "flowsCount",
          ],
        ],
      });
      return {
        data: projects,
      };
    } catch (err) {
      throw new Error(`Error while fetching project list: ${err}`);
    }
  }
}
