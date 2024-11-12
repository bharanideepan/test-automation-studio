// Initializes the `action` service on path `/action`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Action } from './action.class';
import createModel from '../../models/action.model';
import hooks from './action.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'action': Action & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/action', new Action(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('action');

  service.hooks(hooks);
}
