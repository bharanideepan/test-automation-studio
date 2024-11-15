// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const testCaseFlowSequenceActionInput = sequelizeClient.define('testCaseFlowSequenceActionInput', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    testCaseFlowSequenceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    flowActionSequenceId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    inputId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    defaultInput: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    skip: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
  (testCaseFlowSequenceActionInput as any).associate = function (models: any): void {
    testCaseFlowSequenceActionInput.belongsTo(models["testCaseFlowSequence"], {foreignKey: "testCaseFlowSequenceId",})
    testCaseFlowSequenceActionInput.belongsTo(models["flowActionSequence"], {foreignKey: "flowActionSequenceId",})
    testCaseFlowSequenceActionInput.belongsTo(models["input"], {foreignKey: "inputId",})
  };
  return testCaseFlowSequenceActionInput;
}
