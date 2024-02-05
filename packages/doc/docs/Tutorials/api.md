---
sidebar_position: 3
---

# Test an API

The previous examples show how to test an app, but they were far from a production app.
How can we mock an API data or any other external service (bluetooth, date, blockchain...)

Let's have a brief introduction to clean architecture with a simple example every web developer deals with: consume a distant API.

:::tip What You'll Learn

- Fake API data to build a front with no backend
- Easily switch from a lib to another one

:::

:::info Prerequisites

- Understanding of [port-adapter pattern](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/)

:::

<iframe 
    src="https://t7w33f-5173.csb.app/"
    style={{ width: "100%", height: "500px", border: "0", borderRadius: "4px", overflow: "hidden" }}
    title="frosty-surf-4kp6v2"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

[![Edit frosty-surf-4kp6v2](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/github/azot-dev/cortex/tree/main/examples/counter?embed=1&file=%2Fsrc%2Fcortex%2Fservices%2Fcounter.service.ts)

In this example, we will code an app that will list dogs and display random images of them
We will use the pretty simple and well known [dog API](https://dog.ceo/dog-api/documentation/)

## Create a gateway

The API is considered being outside of our app since we have no control of it, we have to keep it at the boundaries of our app and not pollute it with any implementation of it.
So it makes it more testable and switchable by another implementation if needed: a hardcoded API or a fetch or GraphQL implementation for example.

A gateway is an interface in typescript, it describes the type of parameters and return values of the different methods
It is a contract that any adapter should fit to

We want 2 endpoints, one that list all dog breeds and the other showing random images of them
Let's create the gateway:

We can take a look at the [documentation](https://dog.ceo/dog-api/documentation/)

The endpoint is `https://dog.ceo/api/breeds/list/all`, it will always remain the same so it doesn't need any parameter

```JSON
{
    "message": {
        "affenpinscher": [],
        "african": [],
        "airedale": [],
        "akita": [],
        "appenzeller": [],
        "australian": [
            "shepherd"
        ],
        "basenji": [],
        "beagle": [],
        "bluetick": [],
        "borzoi": [],
        "bouvier": [],
        "boxer": [],
        "brabancon": [],
        "briard": [],
        "buhund": [
            "norwegian"
        ],
        "bulldog": [
            "boston",
            "english",
            "french"
        ],
        ...
    },
    "status": "success"
}

```

We notice that the API call needs no parameter and returns a Promise since it is an asynchronous call, containing the breed names as keys and an array of the breed variants as values (we notice that most of them are empty).
There is no detail about the possible status, so I am considering it is either `success` or `error`

So we obtain that

```typescript title="src/cortex/dependencies/api/api.gateway.ts"
type Breed = string
type BreedVariant = string

export interface ApiGateway {
  getBreeds(): Promise<{ message: Record<Breed, BreedVariant[]>, status: "success" | "error" }>
}
```

Now let's take a look at the API endpoint that fetches a random dog picture [here](https://dog.ceo/dog-api/documentation/breed)

The endpoint is `https://dog.ceo/api/breed/hound/images`

the documentation says `Returns a random dog image from a breed, e.g. hound` so we know we have to pass the breed as parameter so the endpoint will look like this `https://dog.ceo/api/breed/${breed}/images/random`

the response will look like this:

```JSON
{
    "message": "https://images.dog.ceo/breeds/hound-english/n02089973_2322.jpg",
    "status": "success"
}
```

We have enough elements to finish to code our gateway:

```typescript title="src/cortex/dependencies/api/api.gateway.ts"
export type Breed = string;
export type BreedVariant = string;
export type ImageUri = string;
export type ResponseStatus = 'success' | 'error';

export interface ApiGateway {
  getBreeds(): Promise<{ message: Record<Breed, BreedVariant[]>; status: ResponseStatus }>;
  getBreedRandomImage(breed: Breed): Promise<{ message: ImageUri; status: ResponseStatus }>;
}
```

## register the dependency

Let's register `api` as a dependency:

```typescript title="src/cortex/dependencies/_dependencies.ts"
import { ApiGateway } from './api/api.gateway'

export interface Dependencies {
    api: ApiGateway
}
```

## Code the use case

We can now use the interface methods in any of our services, the service will use the method without knowing its implementation:

```typescript title="src/cortex/services/dog.service.ts"
import { Breed } from '../dependencies/api/api.gateway';
import { Service } from '../utils/service';

type State = {
  breeds: Breed[];
  selectedBreed: Breed | null;
  currentImage?: string;
};

export class DogService extends Service<State> {
  public static initialState: State = { breeds: [], selectedBreed: null };

  async loadBreeds() {
    const response = await this.dependencies.api.getBreeds();
    const breeds = Object.keys(response.message);
    this.state.breeds.set(breeds);
    if (breeds.length > 0) {
      this.selectBreed(breeds[0]);
    }
  }

  selectBreed(breed: Breed) {
    this.state.selectedBreed.set(breed);
    this.generateImage();
  }

  async generateImage() {
    const response = await this.dependencies.api.getBreedRandomImage(this.state.selectedBreed.get());
    this.state.currentImage.set(response.message);
  }
}
```

Inside the `loadBreeds` function, we use `this.dependencies.api.getBreeds()`, we know what type of data that we will get, but we don't know what adapter we use.
If the lib in the adapter changes, we don't have to change this code

## Code the adapter

Now everything is ready except the implementation of the api.

Let's code the adapter, meaning the implementation of the api gateway, returning the real data.

We decide to implement `fetch` in the project, since it is the only fetching library we know it is perfect

```typescript title="src/cortex/dependencies/api/fetch.api.adapter.ts"
import { ApiGateway, Breed } from './api.gateway';

export class FetchApiAdapter implements ApiGateway {
    async getBreeds() {
      const response = await fetch('https://dog.ceo/api/breed/hound/images');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }

    async getBreedRandomImage(breed: Breed) {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
}
```

## Dependency injection

now we need to inject the `api` dependency into the app

```tsx title="src/index.tsx"
    <CortexProvider coreInstance={new Core({ api: new FetchApiAdapter() })}>
        <App>
    </CortexProvider>
```

Now we notice our app works perfectly!!

## Dependency inversion

In the meantime a colleague tell us that `fetch` sucks and `axios` is way better and easier to use.
That is perfect, it is used only in one place in our app, no need to search and replace each occurrence of `fetch` in the app by `axios`, we just have to write a new adapter:

```typescript title="src/cortex/dependencies/api/axios.api.adapter.ts"
import axios from 'axios';
import { ApiGateway, Breed } from './api.gateway';

export class AxiosApiAdapter implements ApiGateway {
  async getBreeds() {
    const response = await axios.get('https://dog.ceo/api/breeds/list/all');
    return response.data;
  }

  async getBreedRandomImage(breed: Breed) {
    const response = await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
    return response.data;
  }
}
```

Pretty easy to write, we can inject this adapter in the provider so we will use `axios` in the app like below:

```tsx title="src/index.tsx"
    <CortexProvider coreInstance={new CortexProvider({ api: new AxiosApiAdapter() })}>
        <App>
    </CortexProvider>
```

## The backend is not ready yet?

Sometimes, a company needs to show something to the investors in order to raise funds or needs to iterate a lot at an early stage of development
Instead of developing a backend and work few days about its architecture, the database, etc, you can simply inject fake adapters with hardcoded data

```typescript title="src/cortex/dependencies/api/api.axios.adapter.ts"
import { ApiGateway, Breed, ImageUri } from './api.gateway';

const simpsons: Record<Breed, ImageUri[]> = {
  homer: [ ... ],
  bart: [ ... ],
  marge: [ ... ],
  lisa: [ ... ],
  maggie: [ ... ],
};

export class FakeApiAdapter implements ApiGateway {
  async getBreeds() {
    return {
      message: Object.keys(simpsons).reduce((prev, current) => ({ ...prev, [current]: [] }), {}),
      status: 'success' as const,
    };
  }

  async getBreedRandomImage(breed: Breed) {
    const images = simpsons[breed];
    return {
      message: images[Math.floor(Math.random() * images.length)],
      status: 'success' as const,
    };
  }
}

```

Again we just have to inject it in our app to make it work:

```tsx title="src/index.tsx"
    <CortexProvider coreInstance={new CortexProvider({ api: new FakeApiAdapter() })}>
        <App>
    </CortexProvider>
```

The behavior of `FakeApiAdapter` will be the same as `RealApiAdapter` but is using fake hardcoded data (Simpson images here), we don't use any backend here
