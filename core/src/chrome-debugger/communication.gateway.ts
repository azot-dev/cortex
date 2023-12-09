import { ChromeMessageData, ChromeResponse } from './types';

export interface CommunicationGateway {
  sendMessageToChrome<T extends keyof ChromeMessageData>(
    type: T,
    data?: ChromeMessageData[T]
  ): void;
  listenToCoreStateRequest(core: any, serviceNames: string[]): void;
  sendMessageToCore<T extends 'GET_CORE_STATE'>(type: T): void;
  addCoreMessagesListener(
    response: (chromeResponse: ChromeResponse) => void
  ): void;
}
