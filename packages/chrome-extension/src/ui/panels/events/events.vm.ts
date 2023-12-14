import { Store } from '../../../cortex/utils/types';

export const eventsVM = (state: Store) => {
  const services = state.chrome.services.get();
  const events = state.chrome.events.get();
  const selectedId = state.chrome.selectedEvent.get();

  const eventsViewModel = Object.keys(events).map((eventKey: string) => {
    const event = events[eventKey];
    const isSelected = eventKey === selectedId;

    if (event.type === 'INITIAL_CORE_STATE') {
      return {
        label: 'INITIAL STATE',
        type: event.type,
        id: eventKey,
        isClickable: true,
        isSelected,
        time: formatTime(event.date),
      };
    }
    if (event.type === 'CURRENT_CORE_STATE') {
      return {
        label: 'CURRENT_STATE',
        type: event.type,
        id: eventKey,
        isClickable: true,
        isSelected,
        time: formatTime(event.date),
      };
    }
    if (event.type === 'NEW_STATE') {
      return {
        label: 'Store changed',
        type: event.type,
        id: eventKey,
        isSelected: eventKey === selectedId,
        isClickable: true,
        time: calculateTimeDifference(
          Object.values(events)[0].date,
          event.date
        ),
      };
    }
    if (event.type === 'SERVICE_STATE') {
      const { serviceName, methodName, type } = event;
      return {
        label: `[ ${serviceName} ] ${methodName}`,
        color: '#BAE1FF',
        serviceName,
        methodName,
        type,
        id: eventKey,
        isClickable: false,
        isSelected,
        time: calculateTimeDifference(
          Object.values(events)[0].date,
          event.date
        ),
      };
    }
    return { label: 'unknown' };
  });

  const filteredEventsViewModel = eventsViewModel.filter((value) => {
    if (!value) {
      return false;
    }
    if (value?.type === 'NEW_STATE' && !services.store.isVisible) {
      return false;
    }
    if (
      value?.type === 'SERVICE_STATE' &&
      !services[value.serviceName].isVisible
    ) {
      return false;
    }
    return true;
  });

  return filteredEventsViewModel;
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const calculateTimeDifference = (
  originalTimestamp: number,
  newTimestamp: number
): string => {
  const originalDate = new Date(originalTimestamp);
  const newDate = new Date(newTimestamp);
  const diff = newDate.getTime() - originalDate.getTime();

  const diffHours = Math.floor(diff / 3600000);
  const diffMinutes = Math.floor((diff % 3600000) / 60000);
  const diffSeconds = Math.floor((diff % 60000) / 1000);

  return `+${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(
    2,
    '0'
  )}:${String(diffSeconds).padStart(2, '0')}`;
};
