let currentState = {};

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'INITIAL_STATE') {
      currentState = request.data;
      sendResponse({ status: 'Message received' });
    }
  }
);

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'NEW_STATE') {
      currentState = request.data;
      sendResponse({ status: 'Message received' });
    }
  }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_CURRENT_STATE') {
    sendResponse({ data: currentState });
  }
});
