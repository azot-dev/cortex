import { Store } from '../../../cortex/utils/types';

export const currentEventVM = (state: Store) => {
  const selectedEventId = state.chrome.selectedEvent.get();
  const events = state.chrome.events.get();
  const eventsArray = Object.keys(events);

  if (!eventsArray.length) {
    return null;
  }
  if (!selectedEventId) {
    return events[eventsArray[0]];
  }
  return events[selectedEventId];
};
