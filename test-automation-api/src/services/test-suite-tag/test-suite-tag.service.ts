// Initializes the `test-suite-tag` service on path `/test-suite-tag`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { testSuiteTag } from './test-suite-tag.class'
import createModel from '../../models/test-suite-tag.model';
import hooks from './test-suite-tag.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-suite-tag': testSuiteTag & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-suite-tag', new testSuiteTag(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-suite-tag');

  service.hooks(hooks);
}
