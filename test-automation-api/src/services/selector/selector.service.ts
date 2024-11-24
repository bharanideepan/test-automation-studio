// Initializes the `selector` service on path `/selector`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Selector } from './selector.class';
import createModel from '../../models/selector.model';
import hooks from './selector.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'selector': Selector & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/selector', new Selector(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('selector');

  service.hooks(hooks);
}
