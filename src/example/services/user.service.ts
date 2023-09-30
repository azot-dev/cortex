// services/user-service.ts

import { Service } from '../utils/service';

export class UserService extends Service {
  getUser() {
    console.log('Fetching user...');
  }
}
