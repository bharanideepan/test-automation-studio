// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const flowActionSequenceHistory = sequelizeClient.define('flowActionSequenceHistory', {
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
    testCaseFlowSequenceHistoryId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    flowActionSequenceId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    actionName: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    actionType: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    actionXpath: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    inputValue: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    errorMessage: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    assertionMessage: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  (flowActionSequenceHistory as any).associate = function (models: any): void {
    flowActionSequenceHistory.belongsTo(models["testCaseRun"], { foreignKey: "testCaseRunId" });
    flowActionSequenceHistory.belongsTo(models["testCaseFlowSequenceHistory"], { foreignKey: "testCaseFlowSequenceHistoryId" });
    flowActionSequenceHistory.belongsTo(models["flowActionSequence"], { foreignKey: "flowActionSequenceId" });
  };
  return flowActionSequenceHistory;
}
