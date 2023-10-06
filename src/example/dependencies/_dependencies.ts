interface BaseApiGateway {}
interface UserApiGateway {}
interface SomethingGateway {}

export interface Dependencies {
  api: {
    base: BaseApiGateway;
    user: UserApiGateway;
  };
  something: SomethingGateway;
}

export namespace adapters.api {
  export class Base {}
}

export namespace adapters.api {
  export class User {}
}

export namespace adapters {
  export class Something {}
}

new adapters.api.Base();
