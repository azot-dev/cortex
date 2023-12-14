import { ChromeMessageType } from '../../../../core/src/debuggerLib';

type ServiceName = string;

type Changes = {
  path: string[];
  pathTypes: ('object' | 'array')[];
  valueAtPath: any;
  prevAtPath: any;
}[];

type Event = { type: ChromeMessageType; date: number; store: any };

type ServiceMethodEvent = Event & {
  type: 'SERVICE_STATE';
  serviceName: ServiceName;
  methodName: string;
};

type StoreEvent = Event & {
  type: 'NEW_STATE';
  changes: Changes;
  previous: any;
};

type CoreInfoEvent = Event & {
  type: 'INITIAL_CORE_STATE' | 'CURRENT_CORE_STATE';
};

export type Services = Record<ServiceName, { isVisible: boolean }>;

type ChromeStore = {
  services: Services;
  events: Record<string, ServiceMethodEvent | StoreEvent | CoreInfoEvent>;
  selectedEvent: string | null;
};

export const chromeStore: ChromeStore = {
  services: {},
  events: {},
  selectedEvent: null,
};
