export type AllServices<ServiceConstructors> = {
  [K in keyof ServiceConstructors]: InstanceType<ServiceConstructors[K]>;
};
