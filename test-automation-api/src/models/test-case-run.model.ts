// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const testCaseRun = sequelizeClient.define('testCaseRun', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    testCaseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    errorMessage: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    testSuiteRunId: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  });
  (testCaseRun as any).associate = function (models: any): void {
    testCaseRun.belongsTo(models["testCase"], { foreignKey: "testCaseId" });
    testCaseRun.hasMany(models["testCaseFlowSequenceHistory"], { foreignKey: "testCaseRunId" });
    testCaseRun.hasMany(models["flowActionSequenceHistory"], { foreignKey: "testCaseRunId" });
    testCaseRun.belongsTo(models["testSuiteRun"], { foreignKey: "testSuiteRunId" });
  };
  return testCaseRun;
}
