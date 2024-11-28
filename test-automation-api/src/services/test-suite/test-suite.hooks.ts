
const populateTags = (hook: any) => {
  const Sequelize = hook.app.get("sequelizeClient");
  const { tag, testSuiteTag } = Sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: tag,
        through: { model: testSuiteTag }
      }
    ],
    order: [
      ['createdAt', 'ASC'],
    ],
  };
};

const populateTestCases = (hook: any) => {
  const Sequelize = hook.app.get("sequelizeClient");
  const { tag, testSuiteTag, testCase, testCaseTag } = Sequelize.models;
  hook.params.sequelize = {
    raw: false,
    include: [
      {
        model: tag,
        through: {
          model: testSuiteTag
        },
        include: [
          {
            model: testCase,
            through: {
              model: testCaseTag
            }
          }
        ]
      }
    ],
    order: [
      ['createdAt', 'ASC'],
    ],
  };
};

const transformTestCases = (hook: any) => {
  const testCaseIds = new Set();
  const testCases: any = [];
  hook.result.dataValues.tags.map((tag: any) => {
    tag.testCases.map((testCase: any) => {
      if (!testCaseIds.has(testCase.id)) {
        testCaseIds.add(testCase.id);
        testCases.push(testCase);
      }
    })
  })
  hook.result.dataValues.testCases = testCases;
  return hook;
};

export default {
  before: {
    all: [populateTags],
    find: [populateTags],
    get: [populateTestCases],
    create: [populateTags],
    update: [populateTags],
    patch: [],
    remove: []
  },

  after: {
    all: [populateTags],
    find: [populateTags],
    get: [transformTestCases],
    create: [populateTags],
    update: [populateTags],
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
