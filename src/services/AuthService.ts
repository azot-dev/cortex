// services/AuthService.ts
import { Service } from '../Service';

export class AuthService extends Service {
  authenticate() {
    const userService = this.getService('UserService');
    userService.getUser();
  }
}
