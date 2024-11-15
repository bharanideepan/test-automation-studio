import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class FlowActionSequence extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }
  
  async updateSequences(data: any, params: any) {
    try {
      let { removedSequences, updatedSequences, newSequences } = data as any;
      if (removedSequences && removedSequences.length) {
        removedSequences = await Promise.all(removedSequences.map(async (id: string) => {
          const actionInputs = await this.app.service('test-case-flow-sequence-action-input').find({
            query: { flowActionSequenceId: id }
          }) as any;
          await Promise.all(actionInputs.data.map(async (actionInput: any) => {
            await this.app.service('test-case-flow-sequence-action-input').remove(actionInput.id);
          }))
          return await this.app.service('flow-action-sequence').remove(id);
        }))
      }
      if (newSequences && newSequences.length) {
        newSequences = await Promise.all(newSequences.map(async (sequence: any) => {
          return await this.app.service('flow-action-sequence').create(sequence);
        }))
      }
      if (updatedSequences && updatedSequences.length) {
        updatedSequences = await Promise.all(updatedSequences.map(async (sequence: any) => {
          return await this.app.service('flow-action-sequence').patch(sequence.id, sequence);
        }))
      }
      return {removedSequences, newSequences, updatedSequences}
    } catch (err) {
      throw new Error(`Error while updating flow-action-sequence list: ${err}`);
    }
  }
  
  async createSequences(data: any, params: any) {
    try {
      if (data && data.length) {
        const newSequences = await Promise.all(data.map(async (sequence: any) => {
          return await this.app.service('flow-action-sequence').create(sequence);
        }))
        return newSequences;
      }
      return "Payload Empty"
    } catch (err) {
      throw new Error(`Error while updating flow-action-sequence list: ${err}`);
    }
  }
}
