import { HooksObject } from '@feathersjs/feathers';
const populateFields = (hook: any) => {
  const sequelize = hook.app.get("sequelizeClient");
  const { input, testCaseFlowSequenceActionInput } = sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      { model: input },
      { model: testCaseFlowSequenceActionInput },
    ],
  };
};

export default {
  before: {
    all: [],
    find: [],
    get: [populateFields],
    create: [],
    update: [populateFields],
    patch: [populateFields],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
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
