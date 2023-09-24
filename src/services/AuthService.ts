import { BaseService } from '../base';
import { DependenciesType, StoreType } from '../types';
import { AllServices } from './'; // Type déduit pour AllServices

export class AuthService extends BaseService<
  AllServices,
  StoreType,
  DependenciesType
> {
  authenticate() {
    const userService = this.getService('UserService');
    userService.getUser();
  }
}
