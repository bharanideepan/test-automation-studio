import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class TestCaseFlowSequence extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }
  
  // async updateFlowActionMappings(data: any, params: any) {
  //   try {
  //     const { removedFlowActionMappings, updatedFlowActionMappings, newFlowActionMappings } = data;
  //     let [deletedMappings, newMappings, updatedMappings] = [[], [], []] as any;
  //     if (removedFlowActionMappings && removedFlowActionMappings.length) {
  //       deletedMappings = await Promise.all(removedFlowActionMappings.map(async (id: string) => {
  //         return await this.app.service('flow-action-mapping').remove(id);
  //       }))
  //     }
  //     if (newFlowActionMappings && newFlowActionMappings.length) {
  //       newMappings = await Promise.all(newFlowActionMappings.map(async (mapping: any) => {
  //         return await this.app.service('flow-action-mapping').create(mapping);
  //       }))
  //     }
  //     if (updatedFlowActionMappings && updatedFlowActionMappings.length) {
  //       updatedMappings = await Promise.all(updatedFlowActionMappings.map(async (mapping: any) => {
  //         return await this.app.service('flow-action-mapping').patch(mapping.id, mapping);
  //       }))
  //     }
  //     return {deletedMappings, newMappings, updatedMappings}
  //   } catch (err) {
  //     throw new Error(`Error while updating flow-action-mapping list: ${err}`);
  //   }
  // }
  
  // async createFlowActionMappings(data: any, params: any) {
  //   try {
  //     if (data && data.length) {
  //       await Promise.all(data.map(async (mapping: any) => {
  //         await this.app.service('flow-action-mapping').create(mapping);
  //       }))
  //     }
  //     return "success"
  //   } catch (err) {
  //     throw new Error(`Error while updating flow-action-mapping list: ${err}`);
  //   }
  // }
}
