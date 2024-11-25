const populateFields = (hook: any) => {
  const sequelize = hook.app.get("sequelizeClient");
  const { input, selector } = sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      { model: input },
      { model: selector },
    ],
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
    create: [populateFields],
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
