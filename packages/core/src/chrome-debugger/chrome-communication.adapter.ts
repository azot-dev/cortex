import { CommunicationGateway } from './communication.gateway';
import { ChromeMessageData, ChromeMessageType, ChromeRequestType, ChromeResponse, extensionId } from './types';

export class ChromeCommunicationAdapter implements CommunicationGateway {
  addCoreMessagesListener(response: (chromeResponse: ChromeResponse) => void): void {
    chrome.runtime.onMessage.addListener(response);
  }
  sendMessageToChrome<T extends ChromeMessageType>(type: T, data?: ChromeMessageData[T]) {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.error('No chrome environment found, the debugger features cannot work');
      return;
    }
    chrome.runtime.sendMessage(extensionId, { type, data }, () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      }
    });
  }

  sendMessageToCore<T extends ChromeRequestType>(type: T) {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.error('No chrome environment found, the debugger features cannot work');
      return;
    }
    const tabIdParam = new URLSearchParams(window.location.search).get('tabId');
    const tabIdFromPopup = tabIdParam ? parseInt(tabIdParam, 10) : null;

    const tabId = chrome.devtools?.inspectedWindow ? chrome.devtools.inspectedWindow.tabId : tabIdFromPopup;

    chrome.runtime.sendMessage({
      type,
      tabId,
    });
  }

  listenToCoreStateRequest(core: any, serviceNames: string[]) {
    // injects an event listener in the app webpage to get the core info and send it back to the debugger
    document.addEventListener('CoreInfoRequest', () => {
      this.sendMessageToChrome('CURRENT_CORE_STATE', {
        store: core.store.get(),
        serviceNames,
      });
    });
  }
}
