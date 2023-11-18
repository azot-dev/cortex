import { ChromeMessageType } from '../../core/src/debuggerLib';

// Messages coming from core
chrome.runtime.onMessageExternal.addListener(
  ({ type, data }: { type: ChromeMessageType; data: any }) => {
    console.log('external message bien reçu, on le passe direct au devtool');
    console.log({ type, data });
    chrome.runtime.sendMessage({ type, data });
  }
);

// affichage de services et store change séparés
// affichage des services en orange
// affichage du temps écoulé
