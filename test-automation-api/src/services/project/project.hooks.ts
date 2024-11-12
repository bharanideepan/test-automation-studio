const populateFields = (hook: any) => {
  const sequelize = hook.app.get("sequelizeClient");
  const { flow, test_case, action, input } = sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      { model: flow },
      { model: test_case },
      { model: action, include: [{
        model: input
      }] },
    ],
  };
};

export default {
  before: {
    all: [],
    find: [],
    get: [populateFields],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
