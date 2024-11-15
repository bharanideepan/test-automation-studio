// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const input = sequelizeClient.define('input', {
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
    name: {
      type: DataTypes.STRING(5000),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    waitAfterAction: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
  (input as any).associate = function (models: any): void {
    input.belongsTo(models["action"], { foreignKey: "actionId" });
    input.hasMany(models["testCaseFlowSequenceActionInput"], { foreignKey: "inputId" });
  };
  return input;
}
