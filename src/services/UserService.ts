// services/UserService.ts

import { Service } from '../Service';

export class UserService extends Service {
  getUser() {
    console.log('Fetching user...');
  }
}
