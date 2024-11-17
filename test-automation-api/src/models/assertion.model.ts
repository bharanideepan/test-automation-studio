// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const assertion = sequelizeClient.define('assertion', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    testCaseId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    operator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    target: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    customTargetValue: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    useCustomTargetValue: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    errorMessage: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    skip: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  });
  (assertion as any).associate = function (models: any): void {
    assertion.belongsTo(models["testCase"], {foreignKey: "testCaseId",})
  };
  return assertion;
}
