// services/user-service.ts

import { Service } from '../utils/service';

export class UserService extends Service {
  changeFirstName(firstName: string) {
    this.store.user.firstName.set(firstName);
  }
}
