import {
  ChromeMessageType,
  ChromeResponse,
} from '../../../../core/src/debuggerLib';
import { Service } from '../utils/service';

export class ChromeService extends Service {
  init() {
    this.listenToUpdates();
  }

  listenToUpdates() {
    console.log('listening to updates');
    chrome.runtime.onMessage.addListener(
      (response: ChromeResponse<ChromeMessageType>) => {
        console.log('listening updates:', response.type, response.data);
        this.appendEvent(response);
      }
    );
  }

  private appendEvent(response: ChromeResponse<ChromeMessageType>) {
    this.store.chrome.events.set((events) => ({
      ...events,
      [this.generateUniqueId()]: {
        type: response.type,
        date: Date.now(),
        ...response.data,
      },
    }));
  }

  private generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 15);

    return `${timestamp}-${randomString}`;
  }
}
