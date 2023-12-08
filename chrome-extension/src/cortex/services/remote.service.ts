import { Service } from '../utils/service';

export class RemoteService extends Service {
  choose(index: number) {
    this.store.windows.index.set(index);
  }
}
