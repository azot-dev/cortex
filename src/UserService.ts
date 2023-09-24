import { BaseService } from './BaseService';
import { injectable } from 'inversify';

@injectable()
export class UserService<ServiceMapType> extends BaseService<ServiceMapType> {
  getUser() {
    console.log('Fetching user...');
  }
}
