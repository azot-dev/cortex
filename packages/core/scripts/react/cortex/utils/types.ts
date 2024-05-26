import { coreServices } from "../core_services/core_services";
import { services } from "../services/_services";

export type Services = typeof services;
export type CoreServices = typeof coreServices;
export type AllServices = Services & CoreServices;
