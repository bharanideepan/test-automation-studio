// Initializes the `test-case-flow-sequence-history` service on path `/test-case-flow-sequence-history`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TestCaseFlowSequenceHistory } from './test-case-flow-sequence-history.class';
import createModel from '../../models/test-case-flow-sequence-history.model';
import hooks from './test-case-flow-sequence-history.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-case-flow-sequence-history': TestCaseFlowSequenceHistory & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-case-flow-sequence-history', new TestCaseFlowSequenceHistory(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-case-flow-sequence-history');

  service.hooks(hooks);
}
