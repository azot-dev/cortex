import { HTTPGateway } from "./http.gateway";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

export class AxiosHTTPAdapter implements HTTPGateway {
  private axiosInstance!: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    import("axios")
      .then((value) => {
        this.axiosInstance = value.default.create(config);
      })
      .catch(() => {
        throw new Error("Axios must be installed within your project");
      });
  }

  setHeaders(headers: Record<string, string>): void {
    this.axiosInstance.defaults.headers.common = headers;
  }

  addToHeaders(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  getHeaders(): Record<string, any> {
    return this.axiosInstance.defaults.headers.common;
  }

  async get<Response>(url: string, config?: Record<string, unknown>): Promise<Response> {
    const response = await this.axiosInstance.get<Response>(url, config);
    return response.data;
  }

  async post<Response, Request>(url: string, data?: Request, config?: Record<string, unknown>): Promise<Response> {
    const response = await this.axiosInstance.post<Response>(url, data, config);
    return response.data;
  }

  async put<Response, Request>(url: string, data?: Request, config?: Record<string, unknown>): Promise<Response> {
    const response = await this.axiosInstance.put<Response>(url, data, config);
    return response.data;
  }

  async delete<Response>(url: string, config?: Record<string, unknown>): Promise<Response> {
    const response = await this.axiosInstance.delete<Response>(url, config);
    return response.data;
  }

  async patch<Response, Request>(url: string, data?: Request, config?: Record<string, unknown>): Promise<Response> {
    const response = await this.axiosInstance.patch<Response>(url, data, config);
    return response.data;
  }

  setBaseUrl(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  addRequestInterceptor(onFulfilled?: (value: any) => any, onRejected?: (error: any) => any): number {
    return this.axiosInstance.interceptors.request.use(onFulfilled, onRejected);
  }

  addResponseInterceptor(onFulfilled?: (value: any) => any, onRejected?: (error: any) => any): number {
    return this.axiosInstance.interceptors.response.use(onFulfilled, onRejected);
  }
}
