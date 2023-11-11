import { ChromeMessageType } from '../../core/src/debuggerLib';

let currentState = {};

let storeStates: { date: Date; state: any }[] = [];
let services: { date: Date; serviceName: string; methodName: string }[] = [];

const debugStore = {
  storeStates: [],
  services: [],
};

const listenerCallbacks: Partial<
  Record<ChromeMessageType, (data: any) => void>
> = {
  INITIAL_STATE: (data) => {
    currentState = data;
    storeStates = [{ date: new Date(), state: data }];
    services = [];
  },
  NEW_STATE: (data) => {
    currentState = data;
    storeStates.push({ date: new Date(), state: data });
  },
  SERVICE_STATE: ({ serviceName, methodName }) => {
    services.push({ date: new Date(), serviceName, methodName });
  },
  CHECK: () => {},
};

// Messages coming from cores
chrome.runtime.onMessageExternal.addListener(
  (request: { type: ChromeMessageType; data: any }, sender, sendResponse) => {
    listenerCallbacks[request.type]?.(request.data);
    chrome.runtime.sendMessage({ type: 'UPDATE_UI', data: currentState });
  }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_CURRENT_STATE') {
    console.log('getting current state');
    console.log({ currentState });
    sendResponse({ data: currentState });
  }
});
