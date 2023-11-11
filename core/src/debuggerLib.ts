export const chrome = (window as any).chrome;
export const extensionId = 'cbbghjphpnmlbbploeajbblkgmcabnbn';

export type ChromeMessageType =
  | 'INITIAL_STATE'
  | 'NEW_STATE'
  | 'SERVICE_STATE'
  | 'CHECK';

export const enableChromeDebugger = (core: any) => {
  sendMessageToChrome('INITIAL_STATE', core.store.get());

  core.store.onChange((newState: any) => {
    sendMessageToChrome('NEW_STATE', newState.value);
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

const sendMessageToChrome = (type: ChromeMessageType, data?: any) => {
  if (typeof chrome === 'undefined' || !chrome.runtime) {
    console.error(
      'No chrome environment found, the debugger features cannot work'
    );
    return;
  }

  chrome.runtime.sendMessage(extensionId, { type, data }, () => {
    if (chrome.runtime.lastError) {
      throw new Error('Cortex Devtools not detected');
    }
  });
};
