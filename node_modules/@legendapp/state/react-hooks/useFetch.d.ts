export declare function useFetch<T>(input: RequestInfo | URL, init?: RequestInit, valueType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'): import("@legendapp/state").ObservableObject<{
    data?: T | undefined;
    error?: any;
    errorStr?: string | undefined;
    loading: boolean;
}>;
