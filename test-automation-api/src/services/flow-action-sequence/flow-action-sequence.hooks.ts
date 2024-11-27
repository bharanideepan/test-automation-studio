const populateFields = (hook: any) => {
  const sequelize = hook.app.get("sequelizeClient");
  const { action, selector, input } = sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: action,
        include: [
          {
            model: selector
          },
          {
            model: input
          }
        ]
      }
    ],
  }
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [populateFields],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [populateFields],
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
  },
};
