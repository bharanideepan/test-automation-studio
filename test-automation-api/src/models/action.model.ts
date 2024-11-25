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
    name: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    selectorId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    valueRegex: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    projectId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    enter: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  });
  (action as any).associate = function (models: any): void {
    action.belongsTo(models["project"], { foreignKey: "projectId" });
    action.belongsTo(models["selector"], { foreignKey: "selectorId" });
    action.hasMany(models["input"], { foreignKey: "actionId" });
    action.hasMany(models["flowActionSequence"], { foreignKey: "actionId" });
  };
  return action;
}
