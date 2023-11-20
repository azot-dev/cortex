import { Services } from '../store/chrome.store';
import { Service } from '../utils/service';

export class ServicesService extends Service {
  loadServices(serviceNames: string[]) {
    const services: Services = serviceNames.reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue]: { isVisible: true },
      }),
      {}
    );
    services.store = { isVisible: true };
    this.store.chrome.services.set(services);
  }

  toggleServiceVisibility(serviceName: string) {
    this.store.chrome.services[serviceName].isVisible.set((value) => !value);
  }
}
