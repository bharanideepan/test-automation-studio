// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from "sequelize";
import { Application } from "../declarations";

export default function (app: Application): any {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const tag = sequelizeClient.define("tag", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    projectId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
  });
  (tag as any).associate = function (models: any): void {
    tag.belongsTo(models["project"], { foreignKey: "projectId" });
    tag.belongsToMany(models["testCase"], { through: { model: models["testCaseTag"] } });
  };
  return tag;
}

