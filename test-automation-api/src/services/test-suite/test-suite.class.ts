import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class testSuite extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async updateTestSuiteData(data: any, params: any) {
    try {
      let { testSuite, tags } = data as any;
      let updatedTestSuite = await this.app.service('test-suite').patch(testSuite.id, testSuite);
      if (tags.deletedTags) {
        await Promise.all(tags.deletedTags.map(async (testSuiteTagId: any) => {
          await this.app.service("test-suite-tag").remove(testSuiteTagId)
        }))
      }
      if (tags.newTags) {
        await Promise.all(tags.newTags.map(async (newTag: any) => {
          await this.app.service("test-suite-tag").create(newTag)
        }))
      }
      updatedTestSuite = await this.app.service('test-suite').get(testSuite.id);
      return { testSuite: updatedTestSuite }
    } catch (err) {
      throw new Error(`Error while updating test-suite-data: ${err}`);
    }
  }

  async createTestSuiteData(data: any, params: any) {
    try {
      let { testSuite, tags } = data as any;
      let createdTestSuite = await this.app.service('test-suite').create(testSuite);
      if (tags) {
        tags = await Promise.all(tags.map(async (tagId: string) => {
          return await this.app.service("test-suite-tag").create({
            testSuiteId: createdTestSuite.id,
            tagId
          })
        }))
      }
      createdTestSuite = await this.app.service('test-suite').get(createdTestSuite.id);
      return { testSuite: createdTestSuite };
    } catch (err) {
      throw new Error(`Error while creating test-suite-data: ${err}`);
    }
  }

  async duplicateTestSuiteData(data: any, params: any) {
    try {
      let { testSuiteId } = data as any;
      let testSuite = await this.app.service('test-suite').get(testSuiteId);
      testSuite = JSON.parse(JSON.stringify(testSuite));
      let [testSuiteName] = testSuite.name.split("::");
      let newTestSuite = await this.app.service("test-suite").create({
        name: `${testSuiteName}::duplicate-${(new Date().toISOString())}`,
        projectId: testSuite.projectId
      })
      await Promise.all(testSuite.tags.map(async (tag: any) => {
        await this.app.service("test-suite-tag").create({ tagId: tag.testSuiteTag.tagId, testSuiteId: newTestSuite.id })
      }))
      newTestSuite = await this.app.service('test-suite').get(newTestSuite.id);
      return { testSuite: newTestSuite };
    } catch (err) {
      throw new Error(`Error while creating test-suite-data: ${err}`);
    }
  }

  async getTestSuiteHistory(id: any, params: any) {
    try {
      const testSuiteData = await this.app.service('test-suite').get(id, params);
      const testSuiteRuns: any = await this.app.service("test-suite-run").find({
        query: {
          testSuiteId: testSuiteData.dataValues.id
        },
        sequelize: {
          order: [["createdAt", "DESC"]]
        },
      })
      testSuiteData.dataValues.testSuiteRuns = testSuiteRuns.data;
      return testSuiteData
    } catch (err) {
      throw new Error(`Error while fetching executable test-suite-data: ${err}`);
    }
  }

}
