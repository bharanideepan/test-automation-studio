import { HooksObject } from '@feathersjs/feathers';

const populateFields = (hook: any) => {
  const Sequelize = hook.app.get("sequelizeClient");
  const { flow, flowActionSequence, testCaseFlowSequence, action, input } = Sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: testCaseFlowSequence,
        include: [
          {
            model: flow,
            include: [
              {
                model: flowActionSequence,
                include: [
                  {
                    model: action,
                  },
                ]
              },
            ],
          },
        ],
      },
    ],
    order: [
      [{ model: testCaseFlowSequence }, 'order', 'ASC'],
      [
        { model: testCaseFlowSequence },
        { model: flow },
        { model: flowActionSequence },
        'order',
        'ASC',
      ],
    ],
  };

};

const filterTestCaseInputMapping = async (hook: any) => {
  hook.result.dataValues.testCaseFlowSequences = await Promise.all(hook.result.dataValues.testCaseFlowSequences.map(async (testCaseFlowSequence: any) => {
    const testCaseFlowSequenceId = testCaseFlowSequence.id;
    testCaseFlowSequence.dataValues.flow.dataValues.flowActionSequences = await Promise.all(testCaseFlowSequence.dataValues.flow.flowActionSequences.map(async (flowActionSequence: any) => {
      const actionInputs = await hook.app.service('input').find({
        query: {
          actionId: flowActionSequence.dataValues.action.id
        }
      });
      const inputs = await hook.app.service('test-case-flow-sequence-action-input').find({
        query: {
          testCaseFlowSequenceId: testCaseFlowSequenceId,
          flowActionSequenceId: flowActionSequence.dataValues.id
        }
      });
      flowActionSequence.dataValues.testCaseFlowSequenceActionInput = inputs.data[0];
      flowActionSequence.dataValues.action.dataValues.inputs = actionInputs.data;
      return flowActionSequence;
    }))
    return testCaseFlowSequence;
  }))
  return hook;
};

export default {
  before: {
    all: [],
    find: [],
    get: [populateFields],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [filterTestCaseInputMapping],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
} as HooksObject;
