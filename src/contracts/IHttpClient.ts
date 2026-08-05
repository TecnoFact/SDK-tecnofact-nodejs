/**
 * Contrato del cliente HTTP, alineado a la contraparte PHP
 * (TecnoFact\Sdk\Http\HttpClientInterface).
 *
 * Orden de parámetros por paridad con PHP:
 *   get(endpoint, headers, query)
 *   post(endpoint, headers, data)
 *   postMultipart(endpoint, headers, fields)
 *   put(endpoint, headers, data)
 *   delete(endpoint, headers, data)
 *
 * Nota: `endpoint` es la URL ya construida por el Service (patrón PHP);
 * el HttpClient la usa tal cual, SIN anteponer baseUrl. La implementación
 * (HttpClient) recibe `Config` en su constructor y la usa para timeout,
 * retries, verifySsl, etc.
 */
export interface IHttpClient {
  get<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    query?: Record<string, unknown>
  ): Promise<T>;

  post<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    data?: Record<string, unknown>
  ): Promise<T>;

  postMultipart<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    fields?: Record<string, unknown>
  ): Promise<T>;

  put<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    data?: Record<string, unknown>
  ): Promise<T>;

  delete<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    data?: Record<string, unknown>
  ): Promise<T>;
}
