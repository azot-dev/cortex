// utils/service.ts

import { BaseService } from "@azot-dev/cortex/dist";
import { Dependencies } from "../dependencies/_dependencies";
import { services } from "../services/_services";

export abstract class Service<T = any> extends BaseService<T, typeof services, Dependencies> {
  constructor(...args: [any, any, any, any]) {
    super(...args);
  }
}
