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
      console.log({ response });
      console.log('listening updates:', response.type, response.data);
      if (['INITIAL_CORE_STATE', 'CURRENT_CORE_STATE'].includes(response.type)) {
        console.log('reseting events');
        eventsService.resetEvents();
        this.getService('services').loadServices(response.data.serviceNames);
      }
      console.log('appending event', response);
      eventsService.appendEvent(response);
    });
  }

  setupDebugger() {
    // supprimer tous les listeners pour éviter les doublons
    // on pourrait faire une méthode clean dans chacun des adapteurs
  }
}
