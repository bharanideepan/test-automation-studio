import { HooksObject } from '@feathersjs/feathers';
const populateFields = (hook: any) => {
  const sequelize = hook.app.get("sequelizeClient");
  const { action } = sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: action,
        
      },
    ],
    order: [
      [action, 'order', 'ASC'],
    ],
  };
};

const sortActions = (hook: any) => {
  return hook;
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
    get: [sortActions],
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
