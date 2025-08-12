import { createTypedHooks, Core } from "@azot-dev/cortex";
import { services } from "../services/_services";
import type { Dependencies } from "../dependencies/_dependencies";

export type ServiceName = keyof typeof services

export type Services = {
  [K in keyof typeof services]: InstanceType<typeof services[K]>
}

export const { useService } = createTypedHooks<Services>()

export const createCore = (dependencies: Partial<Dependencies> = {}) => {
  return new Core<typeof services, Dependencies>(dependencies, services)
}