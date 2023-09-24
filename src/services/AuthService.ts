import { BaseService } from '../base';
import { AllServices } from './index';

export class AuthService extends BaseService<AllServices> {
  authenticate() {
    const userService = this.getService('UserService');
    userService.getUser();
  }
}
