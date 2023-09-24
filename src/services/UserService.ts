import { BaseService } from '../base';
import { AllServices } from './index';

export class UserService extends BaseService<AllServices> {
  getUser() {
    console.log('Fetching user...');
  }
}
