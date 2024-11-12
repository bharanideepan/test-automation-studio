// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const action = sequelizeClient.define('action', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    flowId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    xpath: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    valueRegex: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  (action as any).associate = function (models: any): void {
    action.hasMany(models["input"], { foreignKey: "actionId" });
    action.hasMany(models["testCaseFlowSequenceActionInput"], { 
      as: 'actionInput', 
      foreignKey: 'actionId' 
    });
    action.belongsTo(models["flow"], { foreignKey: "flowId" });
  };
  return action;
}
