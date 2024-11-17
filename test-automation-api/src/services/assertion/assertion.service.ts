// Initializes the `assertion` service on path `/assertion`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Assertion } from './assertion.class';
import hooks from './assertion.hooks';
import createModel from '../../models/assertion.model'

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'assertion': Assertion & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/assertion', new Assertion(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('assertion');

  service.hooks(hooks);
}
