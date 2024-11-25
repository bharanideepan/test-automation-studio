const populateFields = (hook: any) => {
  hook.params.sequelize = {
    raw: false,
    order: [
      ['createdAt', 'ASC'],
    ],
  };
};

export default {
  before: {
    all: [],
    find: [populateFields],
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
