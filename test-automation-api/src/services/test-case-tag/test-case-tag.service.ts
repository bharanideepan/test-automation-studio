// Initializes the `test-case-tag` service on path `/test-case-tag`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TestCaseTag } from './test-case-tag.class'
import createModel from '../../models/test-case-tag.model';
import hooks from './test-case-tag.hooks'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-case-tag': TestCaseTag & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-case-tag', new TestCaseTag(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-case-tag');

  service.hooks(hooks);
}
