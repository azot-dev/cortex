export const extensionId = 'cbbghjphpnmlbbploeajbblkgmcabnbn';

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

export const enableChromeDebugger = (core: any, serviceNames: string[]) => {
  sendMessageToChrome('INITIAL_CORE_STATE', {
    store: core.store.get(),
    serviceNames,
  });
  listenToCoreStateRequest(core, serviceNames);

  core.store.onChange((newState: any) => {
    sendMessageToChrome('NEW_STATE', {
      store: newState.value,
      changes: newState.changes,
      previous: newState.getPrevious(),
    });
  });
};

const listenToCoreStateRequest = (core: any, serviceNames: string[]) => {
  document.addEventListener('CoreInfoRequest', (e) => {
    sendMessageToChrome('CURRENT_CORE_STATE', {
      store: core.store.get(),
      serviceNames,
    });
  });
};

const ServiceMethodDecorator = (
  serviceName: string,
  methodName: string,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const now = new Date();

    console.log(`[${now.toISOString()}] - ${serviceName}/${methodName} called`);
    sendMessageToChrome('SERVICE_STATE', {
      serviceName,
      methodName,
    });

    return originalMethod.apply(this, args);
  };

  return descriptor;
};

export const decorateAllMethodsWithChromeLogger = <
  T extends { new (...args: any[]): {} }
>(
  serviceName: string,
  classConstructor: T
) => {
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
          ServiceMethodDecorator(serviceName, methodName, descriptor)
        );
      }
    }
  );
};

const sendMessageToChrome = <T extends ChromeMessageType>(
  type: T,
  data?: ChromeMessageData[T]
) => {
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    console.error(
      'No chrome environment found, the debugger features cannot work'
    );
    return;
  }

  chrome.runtime.sendMessage(extensionId, { type, data }, () => {
    if (chrome.runtime.lastError) {
      console.warn('trying to send', type, data);
      throw new Error('Cortex Devtools not detected');
    }
  });
};

export const sendMessageToCore = <T extends ChromeRequestType>(type: T) => {
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    console.error(
      'No chrome environment found, the debugger features cannot work'
    );
    return;
  }

  console.log('Current URL:', window.location.href);
  console.log('Search string:', window.location.search);

  const tabIdParam = new URLSearchParams(window.location.search).get('tabId');
  const tabIdFromPopup = tabIdParam ? parseInt(tabIdParam, 10) : null;

  // can be sent from popup or devtool
  const tabId = chrome.devtools?.inspectedWindow
    ? chrome.devtools.inspectedWindow.tabId
    : tabIdFromPopup;

  console.log('sending message to core with tabId', tabId);
  chrome.runtime.sendMessage({
    type,
    tabId,
  });
};
