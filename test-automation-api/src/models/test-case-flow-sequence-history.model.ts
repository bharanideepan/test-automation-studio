// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const testCaseFlowSequenceHistory = sequelizeClient.define('testCaseFlowSequenceHistory', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    testCaseRunId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    flowName: {
      type: DataTypes.STRING(5000),
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  (testCaseFlowSequenceHistory as any).associate = function (models: any): void {
    testCaseFlowSequenceHistory.belongsTo(models["testCaseRun"], { foreignKey: "testCaseRunId" });
    testCaseFlowSequenceHistory.hasMany(models["flowActionSequenceHistory"], { foreignKey: "testCaseFlowSequenceHistoryId" });
  };
  return testCaseFlowSequenceHistory;
}
