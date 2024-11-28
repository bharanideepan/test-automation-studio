// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const testSuiteRun = sequelizeClient.define('testSuiteRun', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    testSuiteId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  });
  (testSuiteRun as any).associate = function (models: any): void {
    testSuiteRun.hasMany(models["testCaseRun"], { foreignKey: "testSuiteRunId" });
    testSuiteRun.belongsTo(models["testSuite"], { foreignKey: "testSuiteId" });
  };
  return testSuiteRun;
}
