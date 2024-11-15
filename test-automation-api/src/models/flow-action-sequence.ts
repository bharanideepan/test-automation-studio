// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const flowActionSequence = sequelizeClient.define('flowActionSequence', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    actionId: {
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
  (flowActionSequence as any).associate = function (models: any): void {
    flowActionSequence.belongsTo(models["action"], { foreignKey: "actionId", })
    flowActionSequence.belongsTo(models["flow"], { foreignKey: "flowId", })
    flowActionSequence.hasMany(models["testCaseFlowSequenceActionInput"], { foreignKey: "flowActionSequenceId", onDelete: 'CASCADE' })
  };
  return flowActionSequence;
}
