// services/AuthService.ts
import { Service } from '../utils/service';

export class AuthService extends Service {
  authenticate() {
    const userService = this.getService('UserService');
    userService.getUser();
  }
}
