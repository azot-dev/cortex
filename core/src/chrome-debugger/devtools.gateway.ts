export interface DevtoolsGateway {
  enableChromeDebugger(core: any, serviceNames: string[]): void;
  listenToCoreStateRequest(core: any, serviceNames: string[]): void;
  decorateAllMethodsWithChromeLogger<T extends { new (...args: any[]): {} }>(
    serviceName: string,
    classConstructor: T
  ): void;
  ServiceMethodDecorator(
    serviceName: string,
    methodName: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor;
  sendMessageToChrome<T extends ChromeMessageType>(
    type: T,
    data?: ChromeMessageData[T]
  ): void;
  sendMessageToCore<T extends ChromeRequestType>(type: T): void;
}

export type ChromeMessageType = keyof ChromeMessageData;
export type ChromeRequestType = 'GET_CORE_STATE';

type ChromeMessageData = {
  INITIAL_CORE_STATE: { store: Store; serviceNames: string[] };
  CURRENT_CORE_STATE: { store: Store; serviceNames: string[] };
  NEW_STATE: Store;
  SERVICE_STATE: { serviceName: string; methodName: string };
};

export type Store = any;
