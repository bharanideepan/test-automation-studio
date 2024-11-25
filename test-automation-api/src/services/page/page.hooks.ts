import { HooksObject } from '@feathersjs/feathers';
const populateFields = (hook: any) => {
  const sequelize = hook.app.get("sequelizeClient");
  const { selector } = sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      { model: selector },
    ],
    order: [
      ['createdAt', 'ASC'],
      [{ model: selector }, 'createdAt', 'ASC']
    ],
  };
};

export default {
  before: {
    all: [],
    find: [populateFields],
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
