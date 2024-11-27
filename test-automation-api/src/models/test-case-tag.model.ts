// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from "sequelize";
import { Application } from "../declarations";

export default function (app: Application): any {
  const sequelizeClient: Sequelize = app.get("sequelizeClient");
  const testCaseTag = sequelizeClient.define("testCaseTag", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    testCaseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: sequelizeClient.models["testCase"],
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
  (testCaseTag as any).associate = function (models: any): void {
  };
  return testCaseTag;
}

