// Initializes the `test-suit-run` service on path `/test-suit-run`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TestSuitRun } from './test-suit-run.class'
import createModel from '../../models/test-suit-run.model';
import hooks from './test-suit-run.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-suit-run': TestSuitRun & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-suit-run', new TestSuitRun(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-suit-run');

  service.hooks(hooks);
}
