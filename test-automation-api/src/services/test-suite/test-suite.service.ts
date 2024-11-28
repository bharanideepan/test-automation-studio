// Initializes the `test-suite` service on path `/test-suite`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { testSuite } from './test-suite.class'
import createModel from '../../models/test-suite.model';
import hooks from './test-suite.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-suite': testSuite & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-suite', new testSuite(options, app));

  app.use('/test-suite/history', {
    async get(id: any, params: any) {
      return await app.service('test-suite').getTestSuiteHistory(id, params);
    },
  });

  app.use('/test-suite/create', {
    async create(data: any, params: any) {
      return await app.service('test-suite').createTestSuiteData(data, params);
    },
  });
  app.use('/test-suite/update', {
    async create(data: any, params: any) {
      return await app.service('test-suite').updateTestSuiteData(data, params);
    },
  });
  app.use('/test-suite/duplicate', {
    async create(data: any, params: any) {
      return await app.service('test-suite').duplicateTestSuiteData(data, params);
    }
  });

  // Get our initialized service so that we can register hooks
  const service = app.service('test-suite');

  service.hooks(hooks);
}
