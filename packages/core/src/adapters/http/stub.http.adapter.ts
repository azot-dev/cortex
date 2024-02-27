import { HTTPGateway } from "./http.gateway";

export class StubHTTPAdapter implements HTTPGateway {
  private headers: Record<string, string> = {};

  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  addToHeaders(key: string, value: string) {
    this.headers[key] = value;
  }

  getHeaders(): Record<string, string> {
    return this.headers;
  }

  setBaseUrl(baseURL: string) {}

  async get<Response>(url: string, config?: Record<string, unknown>): Promise<Response> {
    return {} as Response;
  }

  async post<Response, Request>(url: string, data?: Request, config?: Record<string, unknown>): Promise<Response> {
    return {} as Response;
  }

  async put<Response, Request>(url: string, data?: Request, config?: Record<string, unknown>): Promise<Response> {
    return {} as Response;
  }

  async delete<Response>(url: string, config?: Record<string, unknown>): Promise<Response> {
    return {} as Response;
  }

  async patch<Response, Request>(url: string, data?: Request, config?: Record<string, unknown>): Promise<Response> {
    return {} as Response;
  }

  addRequestInterceptor(onFulfilled?: (value: any) => any, onRejected?: (error: any) => any): number {
    return 0;
  }

  addResponseInterceptor(onFulfilled?: (value: any) => any, onRejected?: (error: any) => any): number {
    return 0;
  }

  formatResponse<Response>(response: Response): ApiResponse<Response> {
    return { data: response, headers: this.headers, status: 200, statusText: "ok" };
  }

  formatError(status: number, statusText: string = "An error occured"): ApiResponse<undefined> {
    return { data: undefined, headers: this.headers, status, statusText };
  }
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: unknown;
}
