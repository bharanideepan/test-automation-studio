// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from "sequelize";
import { Application } from "../declarations";

export default function (app: Application): any {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const project = sequelizeClient.define("project", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  });
  (project as any).associate = function (models: any): void {
    project.hasMany(models["flow"], { foreignKey: "projectId" });
    project.hasMany(models["testCase"], { foreignKey: "projectId" });
  };
  return project;
}

