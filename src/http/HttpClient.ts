import axios, { AxiosInstance, AxiosResponse } from 'axios';
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
  private readonly config: Config;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly axiosInstance: AxiosInstance;

  constructor(config: Config) {
    this.config = config;
    this.baseUrl = config.getBaseUrl();
    this.timeout = config.getTimeout();

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-API-Key': config.getApiKey(),
        'X-API-Secret': config.getApiSecret(),
      },
    });
  }

  private handleResponse<T>(response: AxiosResponse): T {
    return response.data;
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const message = (data as Record<string, unknown>)?.message as string || 'Request failed';
      const details = data as Record<string, unknown>;

      switch (status) {
        case 401:
          throw new AuthenticationException(
            message || 'Authentication failed',
            status,
            details
          );
        case 400:
          throw new ValidationException(message || 'Validation error', status, details);
        case 404:
          throw new NotFoundException(message || 'Resource not found', status, details);
        case 429:
          throw new RateLimitException(message || 'Rate limit exceeded', status, details);
        case 500:
        case 502:
        case 503:
        case 504:
          throw new ServerException(message || 'Server error', status, details);
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
    try {
      const url = `/${endpoint.replace(/^\//, '')}`;
      const response = await this.axiosInstance.post<T>(url, data, { headers });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T> {
    try {
      const url = `/${endpoint.replace(/^\//, '')}`;
      const response = await this.axiosInstance.get<T>(url, { params, headers });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T = unknown>(
    endpoint: string,
    data: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T> {
    try {
      const url = `/${endpoint.replace(/^\//, '')}`;
      const response = await this.axiosInstance.put<T>(url, data, { headers });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T = unknown>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    try {
      const url = `/${endpoint.replace(/^\//, '')}`;
      const response = await this.axiosInstance.delete<T>(url, { headers });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
