(()=>{"use strict";chrome.runtime.onMessageExternal.addListener((({type:e,data:t})=>{console.log({type:e,data:t}),chrome.runtime.sendMessage({type:e,data:t})})),chrome.runtime.onMessage.addListener((({type:t,tabId:o})=>{e(o)}));const e=e=>{console.log("Executing script for sending CoreInfoRequest withTabId",e);try{chrome.scripting.executeScript({target:{tabId:e},func:()=>{document.dispatchEvent(new CustomEvent("CoreInfoRequest"))}})}catch(e){console.error("Error executing script: ",e)}};chrome.action.onClicked.addListener((function(e){chrome.system.display.getInfo((function(t){var o=(t.find((e=>e.isPrimary))||t[0]).bounds.width-800;console.log({tabIdOnClick:e.id}),console.log({tabUrl:`js/popup.html?tabId=${e.id}`}),chrome.windows.create({url:`js/popup.html?tabId=${e.id}`,type:"popup",width:800,height:600,left:o,top:0})}))}))})();
//# sourceMappingURL=background.js.map