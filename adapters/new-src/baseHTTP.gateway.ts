type Headers = Record<string, string>;

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText?: string;
  headers?: Record<string, string | string[]>;
  error?: string;
}

interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

type RequestInterceptor = (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>;

export type HttpResponsePromise<T> = Promise<HttpResponse<T>>;

export interface HTTPGateway {
  // interceptors: {request: [], response: []}
  setHeaders: () => void;
  getHeaders: () => Headers;
  get<T>(url: string, config?: HttpRequestConfig): HttpResponsePromise<T>;
  put<T>(url: string, config?: HttpRequestConfig): HttpResponsePromise<T>;
  delete<T>(url: string, config?: HttpRequestConfig): HttpResponsePromise<T>;
  patch<T>(url: string, config?: HttpRequestConfig): HttpResponsePromise<T>;
  post<T>(url: string, config?: HttpRequestConfig): HttpResponsePromise<T>;
  addRequestInterceptor: (interceptor: RequestInterceptor) => void;
  addResponseInterceptor: <T>(response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>;
}
