// Initializes the `test-case-flow-sequence` service on path `/test-case-flow-sequence`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TestCaseFlowSequence } from './test-case-flow-sequence.class';
import createModel from '../../models/test-case-flow-sequence';
import hooks from './test-case-flow-sequence.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test-case-flow-sequence': TestCaseFlowSequence & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-case-flow-sequence', new TestCaseFlowSequence(options, app));
  app.use('/test-case-flow-sequence/create-sequences', {
    async create(data: any, params: any) {
      return await app.service('test-case-flow-sequence').createSequences(data, params);
    },
  });
  app.use('/test-case-flow-sequence/update-sequences', {
    async create(data: any, params: any) {
      return await app.service('test-case-flow-sequence').updateSequences(data, params);
    }
  });
  // Get our initialized service so that we can register hooks
  const service = app.service('test-case-flow-sequence');

  service.hooks(hooks);
}
