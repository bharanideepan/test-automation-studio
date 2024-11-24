// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from "sequelize";
import { Application } from "../declarations";

export default function (app: Application): any {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const page = sequelizeClient.define("page", {
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
    }
  });
  (page as any).associate = function (models: any): void {
    page.belongsTo(models["project"], { foreignKey: "projectId" });
    page.hasMany(models["selector"], { foreignKey: "pageId" });
  };
  return page;
}

