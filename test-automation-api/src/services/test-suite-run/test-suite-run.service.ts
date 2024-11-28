// Initializes the `test-suite-run` service on path `/test-suite-run`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { testSuiteRun } from './test-suite-run.class'
import createModel from '../../models/test-suite-run.model';
import hooks from './test-suite-run.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-suite-run': testSuiteRun & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-suite-run', new testSuiteRun(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-suite-run');

  service.hooks(hooks);
}
