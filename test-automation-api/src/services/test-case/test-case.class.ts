import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class TestCase extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async updateTestCaseData(data: any, params: any) {
    try {
      let { testCase, sequences, assertions } = data as any;
      const updatedTestCase = await this.app.service('test-case').patch(testCase.id, testCase);
      if (assertions && assertions.length) {
        await Promise.all(assertions.filter((assertion: any) => (assertion.isRemoved)).map(async (assertion: any) => {
          return await this.app.service('assertion').remove(assertion.id);
        }))
        assertions = assertions.filter((assertion: any) => !assertion.isRemoved)
      }
      if (sequences.removedSequences && sequences.removedSequences.length) {
        sequences.removedSequences = await Promise.all(sequences.removedSequences.map(async (sequence: any) => {
          await Promise.all(sequence.flow.flowActionSequences.map(async (flowActionSequence: any) => {
            if (flowActionSequence.testCaseFlowSequenceActionInput) {
              await this.app.service('test-case-flow-sequence-action-input').remove(flowActionSequence.testCaseFlowSequenceActionInput.id);
            }
          }))
          return await this.app.service('test-case-flow-sequence').remove(sequence.id);
        }))
      }
      if (sequences.newSequences && sequences.newSequences.length) {
        sequences.newSequences = await Promise.all(sequences.newSequences.map(async (sequence: any) => {
          const newSequence = await this.app.service('test-case-flow-sequence').create(sequence);
          await Promise.all(sequence.flow.flowActionSequences.map(async (flowActionSequence: any) => {
            await this.app.service('test-case-flow-sequence-action-input').create({
              ...flowActionSequence.testCaseFlowSequenceActionInput,
              testCaseFlowSequenceId: newSequence.id
            });
          }))
          if (assertions && assertions.length) {
            if (sequence.testCaseFlowSequenceTempId) {
              assertions = assertions.map((assertion: any) => {
                const [x1, y1] = assertion.source.split("::");
                const [a1, b1] = x1.split(":");
                if (b1 === sequence.testCaseFlowSequenceTempId) {
                  return {
                    ...assertion, source: `testCaseFlowSequenceId:${newSequence.id}::${y1}`
                  }
                }
                const [x2, y2] = assertion.target.split("::");
                const [a2, b2] = x2.split(":");
                if (b2 === sequence.testCaseFlowSequenceTempId) {
                  return {
                    ...assertion, target: `testCaseFlowSequenceId:${newSequence.id}::${y2}`
                  }
                }
                return assertion;
              })
            }
          }
          return newSequence;
        }))
      }
      if (sequences.updatedSequences && sequences.updatedSequences.length) {
        sequences.updatedSequences = await Promise.all(sequences.updatedSequences.map(async (sequence: any) => {
          await Promise.all(sequence.flow.flowActionSequences.map(async (flowActionSequence: any) => {
            const testCaseFlowSequenceActionInput = flowActionSequence.testCaseFlowSequenceActionInput;
            if (testCaseFlowSequenceActionInput) {
              if (testCaseFlowSequenceActionInput.id) {
                await this.app.service('test-case-flow-sequence-action-input').patch(testCaseFlowSequenceActionInput.id, testCaseFlowSequenceActionInput);
              } else {
                await this.app.service('test-case-flow-sequence-action-input').create({
                  ...flowActionSequence.testCaseFlowSequenceActionInput,
                  testCaseFlowSequenceId: sequence.id
                });
              }
            }
          }))
          return await this.app.service('test-case-flow-sequence').patch(sequence.id, sequence);
        }))
      }
      if (assertions && assertions.length) {
        assertions = await Promise.all(assertions.map(async (assertion: any) => {
          if (assertion.id) {
            return await this.app.service('assertion').patch(assertion.id, assertion);
          }
          return await this.app.service('assertion').create(assertion);
        }))
      }
      return { testCase: updatedTestCase, sequences: { removedSequences: sequences.removedSequences, newSequences: sequences.newSequences, updatedSequences: sequences.updatedSequences }, assertions }
    } catch (err) {
      throw new Error(`Error while updating test-case-flow-sequence list: ${err}`);
    }
  }

  async createTestCaseData(data: any, params: any) {
    try {
      let { testCase, sequences, assertions } = data as any;
      const createdTestCase = await this.app.service('test-case').create(testCase);
      if (sequences && sequences.length) {
        sequences = await Promise.all(sequences.map(async (sequence: any) => {
          const createdSequence = await this.app.service('test-case-flow-sequence').create({ ...sequence, testCaseId: createdTestCase.id });
          if (assertions && assertions.length) {
            if (sequence.testCaseFlowSequenceTempId) {
              assertions = assertions.map((assertion: any) => {
                const [x1, y1] = assertion.source.split("::");
                const [a1, b1] = x1.split(":");
                if (b1 === sequence.testCaseFlowSequenceTempId) {
                  return {
                    ...assertion, source: `testCaseFlowSequenceId:${createdSequence.id}::${y1}`
                  }
                }
                const [x2, y2] = assertion.target.split("::");
                const [a2, b2] = x2.split(":");
                if (b2 === sequence.testCaseFlowSequenceTempId) {
                  return {
                    ...assertion, target: `testCaseFlowSequenceId:${createdSequence.id}::${y2}`
                  }
                }
                return assertion;
              })
            }
          }
          return createdSequence;
        }))
      }
      if (assertions && assertions.length) {
        assertions = await Promise.all(assertions.map(async (assertion: any) => {
          return await this.app.service('assertion').create({ ...assertion, testCaseId: createdTestCase.id });
        }))
      }
      return { testCase: createdTestCase, sequences, assertions };
    } catch (err) {
      throw new Error(`Error while creating test-case-data: ${err}`);
    }
  }

  async getExecutableTestCaseData(id: any, params: any) {
    try {
      const testCaseData = await this.app.service('test-case').get(id, params);
      testCaseData.dataValues.testCaseFlowSequences = testCaseData.dataValues.testCaseFlowSequences.map((testCaseFlowSequence: any) => {
        testCaseFlowSequence.dataValues.flow.dataValues.flowActionSequences = testCaseFlowSequence.dataValues.flow.dataValues.flowActionSequences.filter((flowActionSequence: any) => {
          return !flowActionSequence.dataValues.testCaseFlowSequenceActionInput.skip;
        })
        return testCaseFlowSequence;
      })
      return testCaseData;
    } catch (err) {
      throw new Error(`Error while fetching executable test-case-data: ${err}`);
    }
  }
}
