import { Config } from '../config';
import { IHttpClient } from '../contracts';
import {
  AuthenticationException,
  NotFoundException,
  RateLimitException,
  ServerException,
  TecnoFactException,
  ValidationException,
} from '../exceptions';

type RequestOptions = {
  query?: Record<string, unknown>;
  json?: Record<string, unknown>;
  multipart?: Record<string, unknown>;
};

const DEFAULT_TIMEOUT_SECONDS = 30;

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableStatus = (status: number): boolean => status === 429 || status >= 500;

/**
 * Cliente HTTP nativo (fetch) del SDK. Alineado a la contraparte PHP
 * (TecnoFact\Sdk\Http\HttpClient) en firmas y manejo de errores.
 *
 * - El `endpoint` se usa tal cual: el Service construye la URL absoluta
 *   (patrón PHP). NO se antepone baseUrl aquí.
 * - Cabeceras por defecto: Accept y Content-Type application/json. El header
 *   Authorization Bearer lo añade el Service por llamada (getHeaders()).
 * - timeout: Config lo guarda en SEGUNDOS; fetch/AbortController usa MS, por
 *   eso aquí se convierte con `* 1000`.
 * - verifySsl: Node fetch (undici) no expone un toggle `verify:false` como
 *   Guzzle. Se mapea de forma pragmática:
 *     true  → comportamiento por defecto (CA del sistema)
 *     false → process.env.NODE_TLS_REJECT_UNAUTHORIZED='0' (INSEGURO; paridad
 *             con PHP `false`). Es global y persistente: limitación conocida.
 *     string (path CA) → process.env.NODE_EXTRA_CA_CERTS=<path>. fetch no
 *             acepta un agente custom de forma simple; esta es la vía soportada
 *             por Node para añadir CAs extra.
 *   Nota: estos ajustes son globales por proceso; no hay forma limpia de
 *   aislarlos por instancia con fetch nativo. Los tests mockean fetch, así que
 *   esto no afecta el comportamiento real en suite.
 * - retry middleware: reintenta en 5xx o 429, hasta `config.getRetries()`
 *   reintentos (intentos totales = 1 + retries), backoff exponencial
 *   `1000 * 2^attempt` ms (attempt parte en 0 para el primer reintento).
 */
export class HttpClient implements IHttpClient {
  private readonly timeoutMs: number;
  private readonly retries: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: Config) {
    this.timeoutMs = config.getTimeout() * 1000;
    this.retries = config.getRetries();
    this.defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const verifySsl = config.getVerifySsl();
    if (verifySsl === false) {
      // INSEGURO. Paridad con PHP `verify => false` (Guzzle). Afecta todo el
      // proceso; sin dispatcher custom en fetch nativo no se puede aislar.
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    } else if (typeof verifySsl === 'string' && verifySsl.trim() !== '') {
      // CA bundle path. Node expose esto vía env para añadir CAs extra.
      process.env.NODE_EXTRA_CA_CERTS = verifySsl;
    }
  }

  public get<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    query?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>('GET', endpoint, headers, { query });
  }

  public post<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    data?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>('POST', endpoint, headers, { json: data });
  }

  public postMultipart<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    fields?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>('POST', endpoint, headers, { multipart: fields });
  }

  public put<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    data?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, headers, { json: data });
  }

  public delete<T = Record<string, unknown>>(
    endpoint: string,
    headers?: Record<string, string>,
    data?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>('DELETE', endpoint, headers, { json: data });
  }

  private async request<T>(
    method: string,
    endpoint: string,
    headers: Record<string, string> | undefined,
    options: RequestOptions
  ): Promise<T> {
    const url = this.buildUrl(endpoint, options.query);
    const maxAttempts = this.retries + 1;

    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (attempt > 0) {
        await delay(1000 * Math.pow(2, attempt - 1));
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.timeoutMs > 0 ? this.timeoutMs : DEFAULT_TIMEOUT_SECONDS * 1000
      );

      try {
        const init = this.buildInit(method, headers, options, controller.signal);
        const response = await fetch(url, init);
        clearTimeout(timeoutId);

        if (response.ok) {
          return this.parseResponse<T>(response, await response.text());
        }

        const status = response.status;
        const requestId =
          response.headers.get('x-request-id') ?? response.headers.get('X-Request-ID');
        const bodyText = await response.text();
        const data = this.safeJson(bodyText);

        if (isRetryableStatus(status) && attempt < maxAttempts - 1) {
          lastError = { status, data, requestId };
          continue;
        }

        this.throwForStatus(status, data, requestId);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof TecnoFactException) {
          throw error;
        }
        if (this.isAbortError(error)) {
          throw new TecnoFactException(`Timeout: la petición excedió ${this.timeoutMs}ms`);
        }
        // Error de red (fetch throw). Reintenta igualmente en 5xx/429 si quedan intentos.
        if (attempt < maxAttempts - 1) {
          lastError = error;
          continue;
        }
        const message = error instanceof Error ? error.message : String(error);
        throw new TecnoFactException(`Error de conexión: ${message}`);
      }
    }

    // Si llegamos aquí, agotamos reintentos sobre un status retryable.
    if (lastError && typeof lastError === 'object' && 'status' in lastError) {
      const le = lastError as {
        status: number;
        data: Record<string, unknown>;
        requestId: string | null;
      };
      this.throwForStatus(le.status, le.data, le.requestId);
    }
    throw new TecnoFactException('Error de conexión: se agotaron los reintentos');
  }

  private buildInit(
    method: string,
    headers: Record<string, string> | undefined,
    options: RequestOptions,
    signal: AbortSignal
  ): RequestInit {
    const merged: Record<string, string> = { ...this.defaultHeaders };

    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        merged[key] = value;
      }
    }

    if (options.multipart) {
      // En multipart, eliminar Content-Type heredado (default o por llamada)
      // para que fetch/FormData imponga su propio boundary (paridad PHP).
      delete merged['Content-Type'];
      delete merged['content-type'];
    }

    const init: RequestInit = {
      method,
      headers: merged,
      signal,
    };

    if (options.multipart) {
      init.body = this.buildFormData(options.multipart);
    } else if (options.json !== undefined) {
      init.body = JSON.stringify(options.json);
    }

    return init;
  }

  private buildFormData(fields: Record<string, unknown>): FormData {
    const formData = new FormData();
    for (const [name, contents] of Object.entries(fields)) {
      if (contents === undefined || contents === null) {
        continue;
      }
      if (contents instanceof Blob) {
        formData.append(name, contents);
      } else if (contents instanceof Uint8Array) {
        formData.append(name, new Blob([contents]));
      } else {
        formData.append(name, String(contents));
      }
    }
    return formData;
  }

  private buildUrl(endpoint: string, query?: Record<string, unknown>): string {
    if (!query || Object.keys(query).length === 0) {
      return endpoint;
    }
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
    const qs = params.toString();
    return qs ? `${endpoint}${endpoint.includes('?') ? '&' : '?'}${qs}` : endpoint;
  }

  private async parseResponse<T>(response: Response, body: string): Promise<T> {
    if (!body || body.trim() === '') {
      return {} as T;
    }
    const requestId = response.headers.get('x-request-id') ?? response.headers.get('X-Request-ID');
    try {
      const parsed = JSON.parse(body);
      // PHP: `is_array($data) ? $data : []`. Array → se devuelve tal cual;
      // cualquier otro tipo no-array → {}.
      if (Array.isArray(parsed)) {
        return parsed as T;
      }
      if (parsed && typeof parsed === 'object') {
        return parsed as T;
      }
      return {} as T;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new TecnoFactException(
        `Error al decodificar respuesta JSON: ${msg}`,
        0,
        null,
        requestId
      );
    }
  }

  private safeJson(body: string): Record<string, unknown> {
    if (!body || body.trim() === '') {
      return {};
    }
    try {
      const parsed = JSON.parse(body);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  private throwForStatus(
    status: number,
    data: Record<string, unknown>,
    requestId: string | null
  ): never {
    const message = this.extractErrorMessage(data);
    const errors = Array.isArray(data.errors) ? data.errors : [];
    const retryAfter = this.toNumber(data.retry_after, 60);

    switch (status) {
      case 400:
      case 422:
        throw new ValidationException(message, errors, requestId);
      case 401:
        throw new AuthenticationException(message, requestId);
      case 404:
        throw new NotFoundException(message, requestId);
      case 429:
        throw new RateLimitException(message, retryAfter, requestId);
      default:
        throw new ServerException(message, status, requestId);
    }
  }

  private extractErrorMessage(data: Record<string, unknown>): string {
    for (const key of ['message', 'error', 'mensaje']) {
      const value = data[key];
      if (typeof value === 'string' && value !== '') {
        return value;
      }
    }
    return 'Error desconocido';
  }

  private toNumber(value: unknown, fallback: number): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
      return Number(value);
    }
    return fallback;
  }

  private isAbortError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.name === 'AbortError';
    }
    return false;
  }
}
