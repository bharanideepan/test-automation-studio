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
    }
  });
  (testCaseRun as any).associate = function (models: any): void {
    testCaseRun.belongsTo(models["testCase"], { foreignKey: "testCaseId" });
  };
  return testCaseRun;
}
