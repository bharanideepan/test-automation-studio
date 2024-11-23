const populateFields = (hook: any) => {
  const Sequelize = hook.app.get("sequelizeClient");
  const { flow, testCaseFlowSequence, testCaseFlowSequenceHistory, flowActionSequenceHistory } = Sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: testCaseFlowSequenceHistory,
        include: [
          {
            model: testCaseFlowSequence,
            include: [
              {
                model: flow,
              },
            ],
          },
        ],
      },
    ],
    order: [
      [{ model: testCaseFlowSequenceHistory }, 'order', 'ASC'],
    ],
  };
};

const includeFlowActionSequencehistories = async (hook: any) => {
  hook.result.dataValues.testCaseFlowSequenceHistories = await Promise.all(hook.result.dataValues.testCaseFlowSequenceHistories.map(async (testCaseFlowSequenceHistory: any) => {
    const flowActionSequenceHistories = await hook.app.service('flow-action-sequence-history').find({
      query: {
        testCaseFlowSequenceHistoryId: testCaseFlowSequenceHistory.dataValues.id
      }
    });
    testCaseFlowSequenceHistory.dataValues.flowActionSequenceHistories = flowActionSequenceHistories.data.sort((a: any, b: any) => a.order - b.order);
    return testCaseFlowSequenceHistory;
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
    get: [includeFlowActionSequencehistories],
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
};
