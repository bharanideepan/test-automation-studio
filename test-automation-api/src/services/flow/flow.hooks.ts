import { HooksObject } from '@feathersjs/feathers';
const populateFields = (hook: any) => {
  const sequelize = hook.app.get("sequelizeClient");
  const { flowActionSequence, action } = sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: flowActionSequence,
        include: [
          {
            model: action
          }
        ]
      },
    ],
    order: [
      [flowActionSequence, 'order', 'ASC'],
    ],
  };
};

export default {
  before: {
    all: [],
    find: [],
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
