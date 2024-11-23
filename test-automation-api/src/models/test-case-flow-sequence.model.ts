// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const testCaseFlowSequence = sequelizeClient.define('testCaseFlowSequence', {
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
    flowId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  (testCaseFlowSequence as any).associate = function (models: any): void {
    testCaseFlowSequence.belongsTo(models["testCase"], { foreignKey: "testCaseId", })
    testCaseFlowSequence.belongsTo(models["flow"], { foreignKey: "flowId", })
    testCaseFlowSequence.hasMany(models["testCaseFlowSequenceActionInput"], { foreignKey: "testCaseFlowSequenceId", onDelete: 'CASCADE' })
    testCaseFlowSequence.hasMany(models["testCaseFlowSequenceHistory"], { foreignKey: "testCaseFlowSequenceId" })
  };
  return testCaseFlowSequence;
}
