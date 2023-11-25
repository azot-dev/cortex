import { ChromeResponse } from '../../../../core/src/debuggerLib';
import { Service } from '../utils/service';

export class EventsService extends Service {
  appendEvent(response: ChromeResponse) {
    const isLastEventSelected = this.isLastEventSelected();
    const newLastEventId = this.generateUniqueId();

    this.store.chrome.events.set((events) => ({
      ...events,
      [newLastEventId]: {
        type: response.type,
        date: Date.now(),
        ...response.data,
      },
    }));
    if (isLastEventSelected) {
      this.store.chrome.selectedEvent.set(newLastEventId);
    }
  }

  resetEvents() {
    this.store.chrome.selectedEvent.set(null);
    this.store.chrome.events.set({});
  }

  selectEvent(eventId: string) {
    this.store.chrome.selectedEvent.set(eventId);
  }

  private isLastEventSelected() {
    const events = Object.keys(this.store.chrome.events.peek());
    const lastEventId = events.length > 0 ? events[events.length - 1] : null;

    return this.store.chrome.selectedEvent.peek() === lastEventId;
  }

  private generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 15);

    return `${timestamp}-${randomString}`;
  }
}
