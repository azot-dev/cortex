const extensionId = 'ljmkbjlbiefamgbmmbohkdbbnpndhcep';

export const launchChromeDebugger = (store) => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.sendMessage(extensionId, {
      type: 'MESSAGE_FROM_PAGE',
      data: 'Hello from localhost',
    });
  }
};
