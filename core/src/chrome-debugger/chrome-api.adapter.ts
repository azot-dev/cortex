import { DevtoolsGateway } from './devtools.gateway';

export const extensionId = 'fpiekoekdbcomggnffgallmgbcmllhgh';

export type ChromeMessageType = keyof ChromeMessageData;
export type ChromeRequestType = 'GET_CORE_STATE';

type ChromeMessageData = {
  INITIAL_CORE_STATE: { store: Store; serviceNames: string[] };
  CURRENT_CORE_STATE: { store: Store; serviceNames: string[] };
  NEW_STATE: Store;
  SERVICE_STATE: { serviceName: string; methodName: string };
};

export type Store = any;

type ChromeResponseByType<T extends ChromeMessageType> = {
  type: T;
  data: ChromeMessageData[T];
};

export type ChromeResponse = ChromeResponseByType<ChromeMessageType>;

export class ChromeApi implements DevtoolsGateway {
  enableChromeDebugger(core: any, serviceNames: string[]) {
    this.sendMessageToChrome('INITIAL_CORE_STATE', {
      store: core.store.get(),
      serviceNames,
    });
    this.listenToCoreStateRequest(core, serviceNames);

    core.store.onChange((newState: any) => {
      this.sendMessageToChrome('NEW_STATE', {
        store: newState.value,
        changes: newState.changes,
        previous: newState.getPrevious(),
      });
    });
  }

  listenToCoreStateRequest(core: any, serviceNames: string[]) {
    document.addEventListener('CoreInfoRequest', () => {
      this.sendMessageToChrome('CURRENT_CORE_STATE', {
        store: core.store.get(),
        serviceNames,
      });
    });
  }

  decorateAllMethodsWithChromeLogger<T extends { new (...args: any[]): {} }>(
    serviceName: string,
    classConstructor: T
  ) {
    Object.getOwnPropertyNames(classConstructor.prototype).forEach(
      (methodName) => {
        if (methodName === 'constructor') return;

        const descriptor = Object.getOwnPropertyDescriptor(
          classConstructor.prototype,
          methodName
        );
        if (descriptor && typeof descriptor.value === 'function') {
          Object.defineProperty(
            classConstructor.prototype,
            methodName,
            this.ServiceMethodDecorator(serviceName, methodName, descriptor)
          );
        }
      }
    );
  }

  ServiceMethodDecorator(
    serviceName: string,
    methodName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    const sendMessageToChrome = this.sendMessageToChrome.bind(this);
    descriptor.value = function (...args: any[]) {
      sendMessageToChrome('SERVICE_STATE', {
        serviceName,
        methodName,
      });

      return originalMethod.apply(this, args);
    };

    return descriptor;
  }

  sendMessageToChrome<T extends ChromeMessageType>(
    type: T,
    data?: ChromeMessageData[T]
  ) {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.error(
        'No chrome environment found, the debugger features cannot work'
      );
      return;
    }

    chrome.runtime.sendMessage(extensionId, { type, data }, () => {
      if (chrome.runtime.lastError) {
        // Handle error, if needed
      }
    });
  }

  sendMessageToCore<T extends ChromeRequestType>(type: T) {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.error(
        'No chrome environment found, the debugger features cannot work'
      );
      return;
    }
    const tabIdParam = new URLSearchParams(window.location.search).get('tabId');
    const tabIdFromPopup = tabIdParam ? parseInt(tabIdParam, 10) : null;

    // can be sent from popup or devtool
    const tabId = chrome.devtools?.inspectedWindow
      ? chrome.devtools.inspectedWindow.tabId
      : tabIdFromPopup;

    chrome.runtime.sendMessage({
      type,
      tabId,
    });
  }
}
