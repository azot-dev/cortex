// utils/service.ts

import { BaseService } from "@azot-dev/cortex";
import { Dependencies } from "../dependencies/_dependencies";
import { AllServices } from "./types";

export abstract class Service<T = any> extends BaseService<T, AllServices, Dependencies> {
  constructor(...args: [any, any, any, any]) {
    super(...args);
  }
}
