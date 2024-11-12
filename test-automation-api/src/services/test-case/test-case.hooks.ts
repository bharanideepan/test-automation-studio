import { HooksObject } from '@feathersjs/feathers';

const populateFields = (hook: any) => {
  const Sequelize = hook.app.get("sequelizeClient");
  const { flow, testCaseFlowSequence, action, input, testCaseFlowSequenceActionInput } = Sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: testCaseFlowSequence,
        as: 'testCaseFlowSequences',
        include: [
          {
            model: flow,
            as: 'flow',
            include: [
              {
                model: action,
                as: 'actions',
                include: [
                  {
                    model: input,
                    as: 'inputs',
                  },
                  {
                    model: testCaseFlowSequenceActionInput,
                    as: 'actionInput',
                    attributes: [
                      ["testCaseFlowSequenceId", "sequenceId"]
                    ],
                    include: [
                      {model: input}
                    ]
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    order: [
      [{ model: testCaseFlowSequence, as: 'testCaseFlowSequences' }, 'order', 'ASC'],
      [
        { model: testCaseFlowSequence, as: 'testCaseFlowSequences' },
        { model: flow, as: 'flow' },
        { model: action, as: 'actions' },
        'order',
        'ASC',
      ],
    ],
  };
  
};

const filterTestCaseInputMapping = (hook: any) => {
  hook.result.dataValues.testCaseFlowSequences = hook.result.dataValues.testCaseFlowSequences.map((testCaseFlowSequence: any) => {
    const testCaseFlowSequenceId = testCaseFlowSequence.id;
    testCaseFlowSequence.dataValues.flow.dataValues.actions = testCaseFlowSequence.dataValues.flow.actions.map((action: any) => {
      action.dataValues.actionInput = action.dataValues.actionInput.find((item: any) => {
        return item.dataValues.sequenceId == testCaseFlowSequenceId
      })
      return action
    })
    return testCaseFlowSequence;
  })
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
