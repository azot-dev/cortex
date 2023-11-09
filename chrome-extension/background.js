"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debuggerLib_1 = require("../core/src/debuggerLib");
var currentState = {};
var storeStates = [];
var services = [];
var listenerCallbacks = {
    INITIAL_STATE: function (data) {
        currentState = data;
        storeStates = [{ date: new Date(), state: data }];
        services = [];
    },
    NEW_STATE: function (data) {
        currentState = data;
        storeStates.push({ date: new Date(), state: data });
    },
    SERVICE_STATE: function (_a) {
        var serviceName = _a.serviceName, methodName = _a.methodName;
        services.push({ date: new Date(), serviceName: serviceName, methodName: methodName });
    },
    CHECK: function () { },
};
// Messages coming from cores
debuggerLib_1.chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    var _a;
    (_a = listenerCallbacks[request.type]) === null || _a === void 0 ? void 0 : _a.call(listenerCallbacks, request.data);
    debuggerLib_1.chrome.runtime.sendMessage({ type: 'UPDATE_UI', data: currentState });
});
debuggerLib_1.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'GET_CURRENT_STATE') {
        console.log('getting current state');
        console.log({ currentState: currentState });
        sendResponse({ data: currentState });
    }
});
