import { Environment, EnvironmentHelper } from '../enums';

export interface ConfigOptions {
  apiKey: string;
  apiSecret: string;
  environment?: Environment;
  timeout?: number;
  retries?: number;
}

export class Config {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly environment: Environment;
  private readonly timeout: number;
  private readonly retries: number;

  constructor(options: ConfigOptions) {
    if (!options.apiKey) {
      throw new Error('apiKey is required');
    }
    if (!options.apiSecret) {
      throw new Error('apiSecret is required');
    }

    this.apiKey = options.apiKey;
    this.apiSecret = options.apiSecret;
    this.environment = options.environment || Environment.SANDBOX;
    
    const timeout = options.timeout !== undefined ? options.timeout : 30000;
    const retries = options.retries !== undefined ? options.retries : 3;

    if (timeout <= 0) {
      throw new Error('timeout must be greater than 0');
    }
    if (retries < 0) {
      throw new Error('retries must be non-negative');
    }

    this.timeout = timeout;
    this.retries = retries;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  getApiSecret(): string {
    return this.apiSecret;
  }

  getEnvironment(): Environment {
    return this.environment;
  }

  getBaseUrl(): string {
    return EnvironmentHelper.getBaseUrl(this.environment);
  }

  getTimeout(): number {
    return this.timeout;
  }

  getRetries(): number {
    return this.retries;
  }

  toObject(): Record<string, unknown> {
    return {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      environment: this.environment,
      baseUrl: this.getBaseUrl(),
      timeout: this.timeout,
      retries: this.retries,
    };
  }
}
