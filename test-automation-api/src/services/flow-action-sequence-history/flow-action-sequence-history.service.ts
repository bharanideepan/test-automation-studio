// Initializes the `flow-action-sequence-history` service on path `/flow-action-sequence-history`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { FlowActionSequenceHistory } from './flow-action-sequence-history.class';
import createModel from '../../models/flow-action-sequence-history.model';
import hooks from './flow-action-sequence-history.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'flow-action-sequence-history': FlowActionSequenceHistory & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/flow-action-sequence-history', new FlowActionSequenceHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('flow-action-sequence-history');

  service.hooks(hooks);
}
