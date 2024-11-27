import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class Flow extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async duplicateFlowData(data: any, params: any) {
    try {
      let { flowId } = data as any;
      let flow = await this.app.service('flow').get(flowId);
      flow = JSON.parse(JSON.stringify(flow));
      let [flowName] = flow.name.split("::");
      const newFlow = await this.app.service("flow").create({
        name: `${flowName}::duplicate-${(new Date().toISOString())}`,
        projectId: flow.projectId
      })

      await Promise.all(await flow.flowActionSequences.map(async (flowActionSequence: any) => {
        return await this.app.service('flow-action-sequence').create({
          actionId: flowActionSequence.actionId,
          flowId: newFlow.id,
          order: flowActionSequence.order
        })
      }))

      return newFlow;
    } catch (err) {
      throw new Error(`Error while creating test-case-data: ${err}`);
    }
  }
}
