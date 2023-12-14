import { Store } from '../../../cortex/utils/types';
import { set } from 'lodash';
import { currentEventVM } from '../events/current-event.vm';

type Changes = {
  path: string[];
  pathTypes: ('object' | 'array')[];
  valueAtPath: any;
  prevAtPath: any;
}[];

export const DIFF_MARKER = '__DIFF__';

const buildDifferencesObject = (changes: Changes) => {
  const diffs = {};
  changes.forEach((change) => {
    const formattedString = `${DIFF_MARKER}${change.prevAtPath} => ${change.valueAtPath}`;
    set(diffs, change.path, formattedString);
  });
  return diffs;
};

export const diffStoreVM = (state: Store) => {
  const currentEvent = currentEventVM(state);
  if (currentEvent === null) {
    return {};
  }
  if (!('changes' in currentEvent)) {
    return currentEvent.store;
  }

  const changes = currentEvent.changes;
  return buildDifferencesObject(changes);
};
