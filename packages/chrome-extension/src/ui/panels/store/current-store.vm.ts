import { Store } from '../../../cortex/utils/types';
import { currentEventVM } from '../events/current-event.vm';

export const currentStoreVM = (state: Store) => {
  const currentEvent = currentEventVM(state)?.store;
  return currentEvent ?? {};
};
