// Initializes the `test-case-run` service on path `/test-case-run`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TestCaseRun } from './test-case-run.class';
import createModel from '../../models/test-case-run.model';
import hooks from './test-case-run.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-case-run': TestCaseRun & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-case-run', new TestCaseRun(options, app));
  app.use('/test-case-run/execute', {
    async create(data: any, params: any) {
      return await app.service('test-case-run').execute(data, params);
    },
  });

  // Get our initialized service so that we can register hooks
  const service = app.service('test-case-run');

  service.hooks(hooks);
}
