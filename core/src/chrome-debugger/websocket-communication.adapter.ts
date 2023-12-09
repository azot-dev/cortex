import { CommunicationGateway } from './communication.gateway';
import { ChromeMessageData, ChromeResponse } from './types';
import io, { Socket } from 'socket.io-client';

export class WebsocketCommunicationAdapter implements CommunicationGateway {
  private chromeSocket: Socket | null = null;
  private coreSocket: Socket | null = null;

  constructor(private host: string, private port: number) {
    this.getChromeSocket();
    this.getCoreSocket();
  }

  private getChromeSocket() {
    if (!this.chromeSocket) {
      this.chromeSocket = io(`http://${this.host}:${this.port}`, {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });
      this.chromeSocket.emit('joinRoom', 'chrome');
    }
    return this.chromeSocket;
  }

  private getCoreSocket() {
    if (!this.coreSocket) {
      this.coreSocket = io(`http://${this.host}:${this.port}`, {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });
      this.coreSocket.emit('joinRoom', 'core');
    }
    return this.coreSocket;
  }

  addCoreMessagesListener(
    response: (chromeResponse: ChromeResponse) => void
  ): void {
    const socket = this.getChromeSocket();
    socket.on('message', response);
  }

  sendMessageToChrome<T extends keyof ChromeMessageData>(
    type: T,
    data?: ChromeMessageData[T] | undefined
  ): void {
    console.log('adapter: sending message to chrome', type, data);
    const socket = this.getCoreSocket();
    socket.emit('message', { type, data }, 'chrome');
  }

  listenToCoreStateRequest(core: any, serviceNames: string[]): void {
    const socket = this.getCoreSocket();
    socket.on('message', () => {
      this.sendMessageToChrome('CURRENT_CORE_STATE', {
        store: core.store.get(),
        serviceNames,
      });
    });
  }

  sendMessageToCore<T extends 'GET_CORE_STATE'>(type: T): void {
    console.log('adapter: sending message to core', type);
    const socket = this.getChromeSocket();
    socket.emit('message', { type }, 'core');
  }

  clean() {
    const socket = this.getChromeSocket();

    socket.off('message');
    socket.disconnect();
  }
}
