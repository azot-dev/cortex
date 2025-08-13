import { CounterService } from "./counter.service";
import { LoggerService } from "./logger.service";

export const services = {
  counter: CounterService,  
  logger: LoggerService,
} as const