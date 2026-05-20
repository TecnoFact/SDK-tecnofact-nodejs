import { Config } from '../config';
import { IHttpClient } from '../contracts';
import {
  AuthenticationException,
  ValidationException,
  NotFoundException,
  RateLimitException,
  ServerException,
  TecnoFactException,
} from '../exceptions';

export class HttpClient implements IHttpClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: Config) {
    this.baseUrl = config.getBaseUrl();
    this.timeout = config.getTimeout();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-API-Key': config.getApiKey(),
      'X-API-Secret': config.getApiSecret(),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\//, '')}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...(options.headers || {}),
        } as Record<string, string>,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const error = new Error('Request failed');
        (error as any).response = {
          status: response.status,
          data,
        };
        throw error;
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    const axiosLikeError = error as any;
    if (axiosLikeError?.response) {
      const { status, data } = axiosLikeError.response;
      const message =
        ((data as Record<string, unknown>)?.message as string) || 'Request failed';
      const details = data as Record<string, unknown>;

      switch (status) {
        case 401:
          throw new AuthenticationException(
            message || 'Authentication failed',
            status,
            details
          );
        case 400:
          throw new ValidationException(
            message || 'Validation error',
            status,
            details
          );
        case 404:
          throw new NotFoundException(
            message || 'Resource not found',
            status,
            details
          );
        case 429:
          throw new RateLimitException(
            message || 'Rate limit exceeded',
            status,
            details
          );
        case 500:
        case 502:
        case 503:
        case 504:
          throw new ServerException(
            message || 'Server error',
            status,
            details
          );
        default:
          throw new TecnoFactException(message, status, details);
      }
    }

    if (error instanceof Error) {
      throw new TecnoFactException(error.message);
    }

    throw new TecnoFactException('Unknown error occurred');
  }

  async post<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
  }

  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T> {
    let url = endpoint;
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      }
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${endpoint}?${queryString}`;
      }
    }
    return this.request<T>(url, {
      method: 'GET',
      headers,
    });
  }

  async put<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    });
  }

  async delete<T = unknown>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}
