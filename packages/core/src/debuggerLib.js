"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkChromeAvailability = exports.decorateAllMethodsWithChromeLogger = exports.enableChromeDebugger = exports.extensionId = exports.chrome = void 0;
exports.chrome = window.chrome;
exports.extensionId = 'ljmkbjlbiefamgbmmbohkdbbnpndhcep';
var enableChromeDebugger = function (core) {
    sendMessageToChrome('INITIAL_STATE', core.store.get());
    core.store.onChange(function (newState) {
        sendMessageToChrome('NEW_STATE', newState.value);
    });
};
exports.enableChromeDebugger = enableChromeDebugger;
var ServiceMethodDecorator = function (serviceName, methodName, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = new Date();
        console.log("[".concat(now.toISOString(), "] - ").concat(serviceName, "/").concat(methodName, " called"));
        sendMessageToChrome('SERVICE_STATE', {
            serviceName: serviceName,
            methodName: methodName,
        });
        return originalMethod.apply(this, args);
    };
    return descriptor;
};
var decorateAllMethodsWithChromeLogger = function (serviceName, classConstructor) {
    Object.getOwnPropertyNames(classConstructor.prototype).forEach(function (methodName) {
        if (methodName === 'constructor')
            return;
        var descriptor = Object.getOwnPropertyDescriptor(classConstructor.prototype, methodName);
        if (descriptor && typeof descriptor.value === 'function') {
            Object.defineProperty(classConstructor.prototype, methodName, ServiceMethodDecorator(serviceName, methodName, descriptor));
        }
    });
};
exports.decorateAllMethodsWithChromeLogger = decorateAllMethodsWithChromeLogger;
var checkChromeAvailability = function () {
    try {
        sendMessageToChrome('CHECK');
    }
    catch (e) {
        return false;
    }
    return true;
};
exports.checkChromeAvailability = checkChromeAvailability;
var sendMessageToChrome = function (type, data) {
    if (typeof exports.chrome === 'undefined' || !exports.chrome.runtime) {
        console.error('No chrome environment found, the debugger features cannot work');
        return;
    }
    exports.chrome.runtime.sendMessage(exports.extensionId, { type: type, data: data }, function () {
        if (exports.chrome.runtime.lastError) {
            throw new Error('Cortex Devtools not detected');
        }
    });
};
