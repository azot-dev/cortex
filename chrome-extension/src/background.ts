import { ChromeMessageType } from '../../core/src/debuggerLib';

// Messages coming from core, they are redirected to the devtool
chrome.runtime.onMessageExternal.addListener(
  ({ type, data }: { type: ChromeMessageType; data: any }) => {
    console.log({ type, data });
    chrome.runtime.sendMessage({ type, data });
  }
);

chrome.runtime.onMessage.addListener(
  ({ type, tabId }: { type: ChromeMessageType; tabId: number }) => {
    console.log('coucou');
    console.log(
      'received a message from the devtool, logged from background.js baby'
    );
    console.log('tab id');
    console.log(tabId);
    console.log({ type });
    requestForCoreInfo(tabId);
  }
);

const requestForCoreInfo = (tabId: number) => {
  console.log('Executing script for sending CoreInfoRequest');
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => {
      document.dispatchEvent(new CustomEvent('CoreInfoRequest'));
    },
  });
};
