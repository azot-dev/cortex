import { BaseService } from "@azot-dev/cortex";
import type { Dependencies } from "../dependencies/_dependencies";
import type { Services } from "./setup";

export abstract class Service<TState = unknown> extends BaseService<Services, Dependencies, TState> {
    constructor() {
        super({} as Dependencies);
    }
}
