import { Service } from '../utils/service';
import { CommunicationService } from '../../../../core/src/chrome-debugger/communication-service';
import { ChromeResponse } from '../../../../core/src/chrome-debugger/types';

export class ChromeService extends Service {
  private communication = new CommunicationService(true);

  init() {
    this.communication.sendMessageToCore('GET_CORE_STATE');
    this.listenToUpdates();
  }

  listenToUpdates() {
    const eventsService = this.getService('events');
    this.communication.addCoreMessagesListener((response: ChromeResponse) => {
      if (['INITIAL_CORE_STATE', 'CURRENT_CORE_STATE'].includes(response.type)) {
        eventsService.resetEvents();
        this.getService('services').loadServices(response.data.serviceNames);
      }
      eventsService.appendEvent(response);
    });
  }
}
