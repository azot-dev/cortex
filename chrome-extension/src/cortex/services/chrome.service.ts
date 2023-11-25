import {
  ChromeResponse,
  sendMessageToCore,
} from '../../../../core/src/debuggerLib';
import { Service } from '../utils/service';

export class ChromeService extends Service {
  init() {
    this.listenToUpdates();
    sendMessageToCore('GET_CORE_STATE');
  }

  listenToUpdates() {
    const eventsService = this.getService('events');
    chrome.runtime.onMessage.addListener((response: ChromeResponse) => {
      console.log('listening updates:', response.type, response.data);
      if (
        ['INITIAL_CORE_STATE', 'CURRENT_CORE_STATE'].includes(response.type)
      ) {
        console.log('reseting events');
        eventsService.resetEvents();
        this.getService('services').loadServices(response.data.serviceNames);
      }
      console.log('appending event', response);
      eventsService.appendEvent(response);
    });
  }
}
