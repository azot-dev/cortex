type Headers = Record<string, string>;

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText?: string;
  headers?: Record<string, string | string[]>;
  error?: string;
}

interface HttpRequestConfig<Params> {
  headers?: Record<string, string>;
  params?: Params;
  timeout?: number;
}

type RequestInterceptor = <Request>(config: HttpRequestConfig<Request>) => HttpRequestConfig<Request> | Promise<HttpRequestConfig<Request>>;

export type HttpResponsePromise<T> = Promise<HttpResponse<T>>;

export interface HTTPGateway {
  setHeaders: (headers: Headers) => void;
  getHeaders: () => Headers;
  get<Response>(url: string, config?: HttpRequestConfig<Request>): HttpResponsePromise<Response>;
  put<Response, Request>(url: string, config?: HttpRequestConfig<Request>): HttpResponsePromise<Response>;
  delete<Response, Request>(url: string, config?: HttpRequestConfig<Request>): HttpResponsePromise<Response>;
  patch<Response, Request>(url: string, config?: HttpRequestConfig<Request>): HttpResponsePromise<Response>;
  post<Response, Request>(url: string, config?: HttpRequestConfig<Request>): HttpResponsePromise<Response>;
  addRequestInterceptor: (interceptor: RequestInterceptor) => void;
  addResponseInterceptor(onFulfilled?: ((value: any) => any) | undefined, onRejected?: ((error: any) => any) | undefined): number;
}
