import { ObservableReadable, ObservableWriteable } from '@legendapp/state';
type TimestampAsString = string;
export declare function trackHistory<T>(obs: ObservableReadable<T>, targetObservable?: ObservableWriteable<Record<TimestampAsString, Partial<T>>>): ObservableWriteable<Record<string, Partial<T>>>;
export {};
