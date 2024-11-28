const populateTestCaseRuns = async (hook: any) => {
  const testCaseRuns = await hook.app.service('test-case-run').find({
    query: {
      testSuiteRunId: hook.result.id
    }
  });
  hook.result.testCaseRuns = await Promise.all(testCaseRuns.data.map(async (testCaseRun: any) => {
    const testCase = await hook.app.service('test-case').get(testCaseRun.testCaseId)
    return {
      ...testCaseRun, testCase
    }
  }))
  return hook;
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [populateTestCaseRuns],
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
