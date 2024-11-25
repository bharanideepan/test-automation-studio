const populateFields = (hook: any) => {
  const sequelize = hook.app.get("sequelizeClient");
  const { flowActionSequence, action, selector, input } = sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: flowActionSequence,
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
        ]
      },
    ],
    order: [
      ['createdAt', 'ASC'],
      [{ model: flowActionSequence }, 'order', 'ASC'],
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
    create: [populateFields],
    update: [populateFields],
    patch: [populateFields],
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
