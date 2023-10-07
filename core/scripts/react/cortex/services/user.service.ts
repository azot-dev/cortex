import { Service } from '../utils/service';

export class UserService extends Service {
  init() {
    // do something at the service initialization
  }

  login() {
    this.store.user.data.assign({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
    });
    this.store.user.isLoggedIn.set(true);
  }
}
