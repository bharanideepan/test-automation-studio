// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const testCase = sequelizeClient.define('testCase', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    projectId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  (testCase as any).associate = function (models: any): void {
    testCase.belongsTo(models["project"], { foreignKey: "projectId" });
    testCase.hasMany(models["testCaseFlowSequence"], { foreignKey: "testCaseId" });
    testCase.hasMany(models["assertion"], { foreignKey: "testCaseId" });
    testCase.hasMany(models["testCaseRun"], { foreignKey: "testCaseId" });
    testCase.belongsToMany(models["tag"], { through: { model: models["testCaseTag"] } });
  };
  return testCase;
}
