// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
import { DataTypes, Model, Sequelize } from 'sequelize';
import { Application } from '../declarations';


export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const flow = sequelizeClient.define('flow', {
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
    projectId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  (flow as any).associate = function (models: any): void {
    flow.belongsTo(models["project"], {foreignKey: "projectId"});
    flow.hasMany(models["flowActionSequence"], {foreignKey: "flowId"});
    flow.hasMany(models["testCaseFlowSequence"], { foreignKey: "flowId" });
  };
  return flow;
}
