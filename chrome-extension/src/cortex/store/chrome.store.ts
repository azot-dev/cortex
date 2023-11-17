import { ChromeMessageType } from '../../../../core/src/debuggerLib';

type ServiceName = string;

type Event = { type: ChromeMessageType; id: string; date: number; store: any };

type ServiceMethodEvent = Event & {
  type: 'SERVICE_STATE';
  serviceName: ServiceName;
  methodName: string;
};

type StoreEvent = Event & { type: 'NEW_STATE' };

type ChromeStore = {
  displayedServices: ServiceName[];
  events: Record<string, ServiceMethodEvent | StoreEvent>;
};

export const chromeStore: ChromeStore = {
  displayedServices: [],
  events: {},
};
