import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class TestCaseFlowSequence extends Service {
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
        removedSequences = await Promise.all(removedSequences.map(async (sequence: any) => {
          await Promise.all(sequence.flow.flowActionSequences.map(async (flowActionSequence: any) => {
            if(flowActionSequence.testCaseFlowSequenceActionInput){
              await this.app.service('test-case-flow-sequence-action-input').remove(flowActionSequence.testCaseFlowSequenceActionInput.id);
            }
          }))
          return await this.app.service('test-case-flow-sequence').remove(sequence.id);
        }))
      }
      if (newSequences && newSequences.length) {
        newSequences = await Promise.all(newSequences.map(async (sequence: any) => {
          const newSequence = await this.app.service('test-case-flow-sequence').create(sequence);
          await Promise.all(sequence.flow.flowActionSequences.map(async (flowActionSequence: any) => {
            await this.app.service('test-case-flow-sequence-action-input').create({
              ...flowActionSequence.testCaseFlowSequenceActionInput,
              testCaseFlowSequenceId: newSequence.id
            });
          }))
          return newSequence;
        }))
      }
      if (updatedSequences && updatedSequences.length) {
        updatedSequences = await Promise.all(updatedSequences.map(async (sequence: any) => {
          await Promise.all(sequence.flow.flowActionSequences.map(async (flowActionSequence: any) => {
            const testCaseFlowSequenceActionInput = flowActionSequence.testCaseFlowSequenceActionInput;
            await this.app.service('test-case-flow-sequence-action-input').patch(testCaseFlowSequenceActionInput.id, testCaseFlowSequenceActionInput);
          }))
          return await this.app.service('test-case-flow-sequence').patch(sequence.id, sequence);
        }))
      }
      return {removedSequences, newSequences, updatedSequences}
    } catch (err) {
      throw new Error(`Error while updating test-case-flow-sequence list: ${err}`);
    }
  }
  
  async createSequences(data: any, params: any) {
    try {
      if (data && data.length) {
        const newSequences = await Promise.all(data.map(async (sequence: any) => {
          return await this.app.service('test-case-flow-sequence').create(sequence);
        }))
        return newSequences;
      }
      return "Payload Empty"
    } catch (err) {
      throw new Error(`Error while updating test-case-flow-sequence list: ${err}`);
    }
  }
}
