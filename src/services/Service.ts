import { Config } from '../config';
import { IHttpClient } from '../contracts';

/**
 * Clase base abstracta para todos los servicios del SDK.
 *
 * Alineada a la contraparte PHP (TecnoFact\Sdk\Service). A diferencia del PHP,
 * el header `Authorization: Bearer` solo se incluye cuando existe un token en
 * la configuración — evita enviar `Bearer null` antes del login.
 */
export abstract class Service {
  protected readonly config: Config;
  protected readonly httpClient: IHttpClient;

  constructor(config: Config, httpClient: IHttpClient) {
    this.config = config;
    this.httpClient = httpClient;
  }

  protected getBaseUrl(): string {
    return this.config.getBaseUrl();
  }

  protected getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const token = this.config.getToken();
    if (token !== null) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
}
