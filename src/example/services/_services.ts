// example/services/_services.ts
import { AuthService } from './auth.service';
import { UserService } from './user.service';

export const serviceConstructors = {
  AuthService,
  UserService,
};

export type AllServices = {
  [K in keyof typeof serviceConstructors]: InstanceType<
    (typeof serviceConstructors)[K]
  >;
};
