import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class Input extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async setDefaultInput(data: any, params: any) {
    try {
      const action = await this.app.service('action').get(data.actionId);
      const inputs = await Promise.all(action.inputs.map(async (input: any) => {
        return await this.app.service("input").patch(input.id, {...input, isDefault: data.id == input.id})
      }))
      return {
        actionId: action.id,
        inputs
      }
    } catch (err) {
      throw new Error(`Error while updating default input list: ${err}`);
    }
  }
}
