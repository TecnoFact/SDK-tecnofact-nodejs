export interface IHttpClient {
  post<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T>;

  get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T>;

  put<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T>;

  delete<T = unknown>(endpoint: string, headers?: Record<string, string>): Promise<T>;
}
