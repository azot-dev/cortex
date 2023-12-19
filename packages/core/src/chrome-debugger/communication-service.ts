import { ChromeCommunicationAdapter } from "./chrome-communication.adapter";
import { CommunicationGateway } from "./communication.gateway";
import { NoCommunicationAdapter } from "./no-communication.adapter";
import { ChromeMessageType, ChromeResponseByType } from "./types";
import { WebsocketCommunicationAdapter } from "./websocket-communication.adapter";

export type ChromeResponse = ChromeResponseByType<ChromeMessageType>;

export class CommunicationService {
  private communication: CommunicationGateway;
  constructor(private debug: boolean = false, private host: string = "localhost", private port?: number) {
    if (process.env.NODE_ENV === "test" || !this.debug) {
      this.communication = new NoCommunicationAdapter();
    } else if (this.port) {
      this.communication = new WebsocketCommunicationAdapter(this.host, this.port);
    } else {
      this.communication = new ChromeCommunicationAdapter();
    }

    this.sendMessageToCore = this.communication.sendMessageToCore.bind(this.communication);
    this.addCoreMessagesListener = this.communication.addCoreMessagesListener.bind(this.communication);
  }
  sendMessageToCore;
  addCoreMessagesListener;
  enableChromeDebugger(core: any, serviceNames: string[]) {
    if (!this.debug) {
      return;
    }
    this.communication.sendMessageToChrome("INITIAL_CORE_STATE", {
      store: core.store.get(),
      serviceNames,
    });
    this.communication.listenToCoreStateRequest(core, serviceNames);

    core.store.onChange((newState: any) => {
      this.communication.sendMessageToChrome("NEW_STATE", {
        store: newState.value,
        changes: newState.changes,
        previous: newState.getPrevious(),
      });
    });
  }

  decorateAllMethodsWithChromeLogger<T extends { new (...args: any[]): {} }>(serviceName: string, classConstructor: T) {
    if (!this.debug) {
      return;
    }
    Object.getOwnPropertyNames(classConstructor.prototype).forEach((methodName) => {
      if (methodName === "constructor") return;

      const descriptor = Object.getOwnPropertyDescriptor(classConstructor.prototype, methodName);
      if (descriptor && typeof descriptor.value === "function") {
        Object.defineProperty(classConstructor.prototype, methodName, this.serviceMethodDecorator(serviceName, methodName, descriptor));
      }
    });
  }

  serviceMethodDecorator(serviceName: string, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const communication = this.communication;

    descriptor.value = function (...args: any[]) {
      communication.sendMessageToChrome("SERVICE_STATE", { serviceName, methodName });

      return originalMethod.apply(this, args);
    };

    return descriptor;
  }
}
