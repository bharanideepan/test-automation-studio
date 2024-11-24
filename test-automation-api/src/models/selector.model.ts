// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from "sequelize";
import { Application } from "../declarations";

export default function (app: Application): any {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const selector = sequelizeClient.define("selector", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    xpath: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    pageId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  });
  (selector as any).associate = function (models: any): void {
    selector.belongsTo(models["page"], { foreignKey: "pageId" });
    selector.hasMany(models["action"], { foreignKey: "selectorId" });
  };
  return selector;
}

