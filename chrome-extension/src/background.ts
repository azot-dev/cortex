import { ChromeMessageType } from '../../core/src/debuggerLib';

// Messages coming from core, they are redirected to the devtool
chrome.runtime.onMessageExternal.addListener(({ type, data }: { type: ChromeMessageType; data: any }) => {
  chrome.runtime.sendMessage({ type, data });
});

chrome.runtime.onMessage.addListener(({ type, tabId }: { type: ChromeMessageType; tabId: number }) => {
  requestForCoreInfo(tabId);
});

const requestForCoreInfo = (tabId: number) => {
  try {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        document.dispatchEvent(new CustomEvent('CoreInfoRequest'));
      },
    });
  } catch (error) {
    console.error('Error executing script: ', error);
  }
};

chrome.action.onClicked.addListener(function (tab) {
  chrome.system.display.getInfo(function (displays) {
    var primaryDisplay = displays.find((display) => display.isPrimary) || displays[0];

    var width = 800;
    var height = 600;

    var left = primaryDisplay.bounds.width - width;
    var top = 0;

    chrome.windows.create({
      url: `js/popup.html?tabId=${tab.id}`,
      type: 'popup',
      width: width,
      height: height,
      left: left,
      top: top,
    });
  });
});
