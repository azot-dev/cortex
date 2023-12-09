export const extensionId = 'cbbghjphpnmlbbploeajbblkgmcabnbn'; // 'fpiekoekdbcomggnffgallmgbcmllhgh'

export type ChromeMessageType = keyof ChromeMessageData;
export type ChromeRequestType = 'GET_CORE_STATE';

export type ChromeMessageData = {
  INITIAL_CORE_STATE: { store: Store; serviceNames: string[] };
  CURRENT_CORE_STATE: { store: Store; serviceNames: string[] };
  NEW_STATE: Store;
  SERVICE_STATE: { serviceName: string; methodName: string };
};

export type Store = any;

export type ChromeResponseByType<T extends ChromeMessageType> = {
  type: T;
  data: ChromeMessageData[T];
};

export type ChromeResponse = ChromeResponseByType<ChromeMessageType>;
