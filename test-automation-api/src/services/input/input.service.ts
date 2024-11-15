// Initializes the `input` service on path `/input`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Input } from './input.class';
import createModel from '../../models/input.model';
import hooks from './input.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'input': Input & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/input', new Input(options, app));
  app.use('/input/set-default', {
    async create(data: any, params: any) {
      return await app.service('input').setDefaultInput(data, params);
    },
  });

  // Get our initialized service so that we can register hooks
  const service = app.service('input');

  service.hooks(hooks);
}
