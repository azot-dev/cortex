import { AxiosHTTPAdapter } from "./http/axios.http.adapter";
import { HTTPGateway } from "./http/http.gateway";
import { StubHTTPAdapter } from "./http/stub.http.adapter";
import { AsyncStorageStorageAdapter } from "./storage/async-storage.storage.adapter";
import { LocalStorageStorageAdapter } from "./storage/local-storage.storage.adapter";
import { StorageGateway } from "./storage/storage.gateway";
import { StubStorageAdapter } from "./storage/stub.storage.adapter";

export namespace Adapter {
  export namespace HTTP {
    export const Axios = AxiosHTTPAdapter;
    export const Stub = StubHTTPAdapter;
  }
  export namespace Storage {
    export const LocalStorage = LocalStorageStorageAdapter;
    export const AsyncStorage = AsyncStorageStorageAdapter;
    export const Stub = StubStorageAdapter;
  }
}

export namespace Gateway {
  export type HTTP = HTTPGateway;
  export type Storage = StorageGateway;
}
