import { Environment, EnvironmentHelper } from '../enums';

const API_URL_PRODUCTION = 'https://panelcfdi.tecnofact.mx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ConfigOptions {
  email: string;
  password: string;
  environment?: Environment;
  timeout?: number;
  retries?: number;
  verifySsl?: boolean | string;
}

/**
 * Configuración del SDK. Alineada a la contraparte PHP
 * (TecnoFact\Sdk\Config). Sustituye el anterior esquema apiKey/apiSecret por
 * autenticación basada en email/password + token Bearer gestionado por
 * AuthService.
 */
export class Config {
  private readonly email: string;
  private readonly password: string;
  private readonly environment: Environment;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly verifySsl: boolean | string;
  private readonly baseUrl: string;
  private token: string | null = null;

  constructor(options: ConfigOptions) {
    this.validateEmail(options.email);
    this.validatePassword(options.password);

    const environment = options.environment ?? Environment.PRODUCTION;
    if (environment !== Environment.PRODUCTION) {
      throw new Error(
        `Entorno no soportado: "${environment}". El único entorno disponible es production.`
      );
    }

    const timeout = options.timeout ?? 30;
    this.validateTimeout(timeout);

    const retries = options.retries ?? 3;
    this.validateRetries(retries);

    const verifySsl = options.verifySsl ?? true;
    this.validateVerifySsl(verifySsl);

    this.email = options.email;
    this.password = options.password;
    this.environment = environment;
    this.timeout = timeout;
    this.retries = retries;
    this.verifySsl = verifySsl;
    this.baseUrl = this.resolveBaseUrl(environment);
  }

  public static fromEnvironment(): Config {
    const email = process.env.TECN_FACT_EMAIL;
    const password = process.env.TECN_FACT_PASSWORD;

    if (!email) {
      throw new Error('Variable de entorno TECN_FACT_EMAIL es requerida');
    }
    if (!password) {
      throw new Error('Variable de entorno TECN_FACT_PASSWORD es requerida');
    }

    const rawEnvironment = process.env.TECN_FACT_ENVIRONMENT ?? 'production';
    const environment = EnvironmentHelper.fromValue(rawEnvironment);

    const rawTimeout = process.env.TECN_FACT_TIMEOUT;
    const timeout = rawTimeout !== undefined && rawTimeout !== '' ? parseInt(rawTimeout, 10) : 30;

    const rawRetries = process.env.TECN_FACT_RETRIES;
    const retries = rawRetries !== undefined && rawRetries !== '' ? parseInt(rawRetries, 10) : 3;

    const verifySsl = Config.parseVerifySsl(process.env.TECN_FACT_VERIFY_SSL);

    return new Config({ email, password, environment, timeout, retries, verifySsl });
  }

  private static parseVerifySsl(raw: string | undefined): boolean | string {
    if (raw === undefined || raw === '') {
      return true;
    }
    const lowered = raw.toLowerCase();
    if (lowered === 'true' || raw === '1') {
      return true;
    }
    if (lowered === 'false' || raw === '0') {
      return false;
    }
    return raw;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getEnvironment(): Environment {
    return this.environment;
  }

  public isProduction(): boolean {
    return this.environment === Environment.PRODUCTION;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getTimeout(): number {
    return this.timeout;
  }

  public getRetries(): number {
    return this.retries;
  }

  public getVerifySsl(): boolean | string {
    return this.verifySsl;
  }

  public getToken(): string | null {
    return this.token;
  }

  public setToken(token: string | null): void {
    this.token = token;
  }

  public toObject(): Record<string, unknown> {
    return {
      environment: this.environment,
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      retries: this.retries,
      verifySsl: this.verifySsl,
    };
  }

  private resolveBaseUrl(environment: Environment): string {
    if (environment !== Environment.PRODUCTION) {
      throw new Error(
        `Entorno no soportado: "${environment}". El único entorno disponible es production.`
      );
    }
    return API_URL_PRODUCTION;
  }

  private validateEmail(email: string): void {
    if (!email || email.trim() === '') {
      throw new Error('Email no puede estar vacío');
    }
    if (!EMAIL_REGEX.test(email)) {
      throw new Error('Email no tiene un formato válido');
    }
  }

  private validatePassword(password: string): void {
    if (!password || password.trim() === '') {
      throw new Error('Password no puede estar vacío');
    }
  }

  private validateTimeout(timeout: number): void {
    if (timeout < 1 || timeout > 300) {
      throw new Error('Timeout debe estar entre 1 y 300 segundos');
    }
  }

  private validateRetries(retries: number): void {
    if (retries < 0 || retries > 10) {
      throw new Error('Retries debe estar entre 0 y 10');
    }
  }

  private validateVerifySsl(verifySsl: boolean | string): void {
    if (typeof verifySsl === 'string' && verifySsl.trim() === '') {
      throw new Error('VerifySsl no puede ser un string vacío');
    }
  }
}
