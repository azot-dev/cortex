import { Service } from '../utils/service';

export class WindowsService extends Service {
  choose(index: number) {
    this.store.windows.index.set(index);
  }
}
