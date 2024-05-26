import { createCortexFactory } from "@azot-dev/cortex";
import { services } from "./services/_services";
import { Dependencies } from "./dependencies/_dependencies";
import { coreServices } from "./core_services/core_services";

export const Core = createCortexFactory<Dependencies>()(services, coreServices);
