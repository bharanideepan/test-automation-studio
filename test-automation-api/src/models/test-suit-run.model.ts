// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const testSuitRun = sequelizeClient.define('testSuitRun', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
  });
  (testSuitRun as any).associate = function (models: any): void {
    testSuitRun.hasMany(models["testCaseRun"], { foreignKey: "testSuitRunId" });
  };
  return testSuitRun;
}
