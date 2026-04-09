export enum Environment {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production',
}

export class EnvironmentHelper {
  private static readonly labels: Record<Environment, string> = {
    [Environment.SANDBOX]: 'Sandbox',
    [Environment.PRODUCTION]: 'Producción',
  };

  private static readonly baseUrls: Record<Environment, string> = {
    [Environment.SANDBOX]: 'https://sandbox.tecnofact.com/api',
    [Environment.PRODUCTION]: 'https://api.tecnofact.com/api',
  };

  static isProduction(env: Environment): boolean {
    return env === Environment.PRODUCTION;
  }

  static isSandbox(env: Environment): boolean {
    return env === Environment.SANDBOX;
  }

  static getLabel(env: Environment): string {
    return this.labels[env];
  }

  static getBaseUrl(env: Environment): string {
    return this.baseUrls[env];
  }
}
