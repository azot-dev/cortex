import { createCortexFactory, createDebuggerService } from "@azot-dev/cortex/dist";
import { services } from "./services/_services";
import { Dependencies } from "./dependencies/_dependencies";

export const Core = createCortexFactory<Dependencies>()(services, { debugger: createDebuggerService({}) });
