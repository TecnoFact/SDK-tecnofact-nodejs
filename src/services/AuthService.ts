import { AuthenticationException } from '../exceptions';
import { Config } from '../config';
import { IHttpClient } from '../contracts';
import { Service } from './Service';

/**
 * Servicio de autenticación. Alineado a TecnoFact\Sdk\AuthService.
 *
 * Tras un login correcto, el JWT (`access_token`) se almacena en la instancia
 * de `Config` y se incluye automáticamente como `Authorization: Bearer` en
 * las llamadas subsiguientes del resto de servicios.
 */
export class AuthService extends Service {
  constructor(config: Config, httpClient: IHttpClient) {
    super(config, httpClient);
  }

  public async login(email: string, password: string): Promise<Record<string, unknown>> {
    try {
      const response = await this.httpClient.post(
        `${this.getBaseUrl()}/api/login`,
        this.getHeaders(),
        { email, password }
      );
      if (response['access_token'] !== undefined && typeof response['access_token'] === 'string') {
        this.config.setToken(response['access_token']);
      }
      return response;
    } catch (e) {
      throw new AuthenticationException(`Failed to authenticate: ${(e as Error).message}`);
    }
  }

  public async refreshToken(refreshToken: string): Promise<Record<string, unknown>> {
    try {
      const response = await this.httpClient.post(
        `${this.getBaseUrl()}/auth/refresh`,
        this.getHeaders(),
        { refresh_token: refreshToken }
      );
      if (response['access_token'] !== undefined && typeof response['access_token'] === 'string') {
        this.config.setToken(response['access_token']);
      }
      return response;
    } catch (e) {
      throw new AuthenticationException(`Failed to refresh token: ${(e as Error).message}`);
    }
  }

  public async logout(): Promise<boolean> {
    try {
      await this.httpClient.post(`${this.getBaseUrl()}/auth/logout`, this.getHeaders(), {});
      this.config.setToken(null);
      return true;
    } catch (e) {
      throw new AuthenticationException(`Failed to logout: ${(e as Error).message}`);
    }
  }
}
