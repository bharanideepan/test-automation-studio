// Initializes the `flow-action-sequence` service on path `/flow-action-sequence`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { FlowActionSequence } from './flow-action-sequence.class';
import createModel from '../../models/flow-action-sequence';
import hooks from './flow-action-sequence.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'flow-action-sequence': FlowActionSequence & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/flow-action-sequence', new FlowActionSequence(options, app));
  app.use('/flow-action-sequence/create-sequences', {
    async create(data: any, params: any) {
      return await app.service('flow-action-sequence').createSequences(data, params);
    },
  });
  app.use('/flow-action-sequence/update-sequences', {
    async create(data: any, params: any) {
      return await app.service('flow-action-sequence').updateSequences(data, params);
    }
  });
  // Get our initialized service so that we can register hooks
  const service = app.service('flow-action-sequence');

  service.hooks(hooks);
}
