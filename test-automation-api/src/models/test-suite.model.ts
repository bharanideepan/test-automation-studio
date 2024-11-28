// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const testSuite = sequelizeClient.define('testSuite', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    projectId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  });
  (testSuite as any).associate = function (models: any): void {
    testSuite.belongsTo(models["project"], { foreignKey: "projectId" });
    testSuite.belongsToMany(models["tag"], { through: { model: models["testSuiteTag"] } });
    testSuite.hasMany(models["testSuiteRun"], { foreignKey: "testSuiteId" });
  };
  return testSuite;
}
