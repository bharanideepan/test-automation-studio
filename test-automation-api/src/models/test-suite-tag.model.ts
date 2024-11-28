// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from "sequelize";
import { Application } from "../declarations";

export default function (app: Application): any {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const testSuiteTag = sequelizeClient.define("testSuiteTag", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    testSuiteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: sequelizeClient.models["testSuite"],
        key: 'id',
      },
    },
    tagId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: sequelizeClient.models["tag"],
        key: 'id',
      },
    },
  });
  (testSuiteTag as any).associate = function (models: any): void {
  };
  return testSuiteTag;
}

