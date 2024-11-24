const populateFields = (hook: any) => {
  const sequelize = hook.app.get("sequelizeClient");
  const { flow, testCase, action, input, flowActionSequence, page, selector } = sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: flow,
        include: [
          {
            model: flowActionSequence,
            include: [
              {
                model: action,
                include: [
                  {
                    model: input
                  }
                ]
              }
            ]
          }
        ]
      },
      { model: testCase },
      {
        model: action, include: [{
          model: input
        }, {
          model: selector
        }]
      },
      {
        model: page, include: [{
          model: selector
        }]
      }
    ],
    order: [
      [{ model: flow }, 'createdAt', 'ASC'],
      [{ model: testCase }, 'createdAt', 'ASC'],
      [{ model: action }, 'createdAt', 'ASC'],
      [{ model: action }, { model: input }, 'createdAt', 'ASC'],
      [
        { model: flow },
        { model: flowActionSequence },
        'order',
        'ASC',
      ]
    ]
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
