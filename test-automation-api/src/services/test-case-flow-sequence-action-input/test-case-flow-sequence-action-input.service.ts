// Initializes the `test-case-flow-sequence-action-input` service on path `/test-case-flow-sequence-action-input`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TestCaseFlowSequenceActionInput } from './test-case-flow-sequence-action-input.class';
import createModel from '../../models/test-case-flow-sequence-action-input';
import hooks from './test-case-flow-sequence-action-input.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-case-flow-sequence-action-input': TestCaseFlowSequenceActionInput & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-case-flow-sequence-action-input', new TestCaseFlowSequenceActionInput(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-case-flow-sequence-action-input');

  service.hooks(hooks);
}
