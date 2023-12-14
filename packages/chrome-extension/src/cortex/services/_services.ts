import { ChromeService } from './chrome.service';
import { EventsService } from './events.service';
import { RemoteService } from './remote.service';
import { ServicesService } from './services.service';
import { WindowsService } from './windows.service';

export const services = {
  chrome: ChromeService,
  events: EventsService,
  services: ServicesService,
  windows: WindowsService,
  remote: RemoteService,
};
