import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class testSuiteRun extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async execute(data: any, params: any) {
    try {
      let { testSuiteId } = data as any;
      const testSuite = await this.app.service('test-suite').get(testSuiteId);
      console.log(testSuite)
      const testSuitRun = await this.app.service('test-suite-run').create({
        testSuiteId: testSuite.dataValues.id,
        status: "ADDED_TO_QUEUE"
      });
      await Promise.all(testSuite.dataValues.testCases.map(async (testCase: any) => {
        await this.app.service("test-case-run").execute({
          testCaseId: testCase.id,
          testSuiteRunId: testSuitRun.id
        }, {})
      }))
      return testSuitRun;
    } catch (err) {
      throw new Error(`Error while creating test-suit-run-data: ${err}`);
    }
  }
}
