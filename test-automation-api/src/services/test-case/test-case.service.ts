// Initializes the `test-case` service on path `/test-case`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TestCase } from './test-case.class';
import createModel from '../../models/test-case.model';
import hooks from './test-case.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-case': TestCase & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-case', new TestCase(options, app));

  app.use('/test-case/history', {
    async get(id: any, params: any) {
      return await app.service('test-case').getTestCaseHistory(id, params);
    },
  });
  app.use('/test-case/executable', {
    async get(id: any, params: any) {
      return await app.service('test-case').getExecutableTestCaseData(id, params);
    },
  });
  app.use('/test-case/create', {
    async create(data: any, params: any) {
      return await app.service('test-case').createTestCaseData(data, params);
    },
  });
  app.use('/test-case/update', {
    async create(data: any, params: any) {
      return await app.service('test-case').updateTestCaseData(data, params);
    }
  });
  app.use('/test-case/duplicate', {
    async create(data: any, params: any) {
      return await app.service('test-case').duplicateTestCaseData(data, params);
    }
  });

  // Get our initialized service so that we can register hooks
  const service = app.service('test-case');

  service.hooks(hooks);
}
