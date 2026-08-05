/**
 * Entornos soportados por el SDK.
 *
 * Alineado a la contraparte PHP (TecnoFact\Sdk\Enums\Environment). Sandbox NO
 * está disponible por ahora, por lo que se expone únicamente PRODUCTION.
 */
export enum Environment {
  PRODUCTION = 'production',
}

/**
 * Helpers de entorno. Se conservan por compatibilidad con los puntos de llamada
 * existentes, pero reflejan el contrato actual (sin sandbox).
 */
export class EnvironmentHelper {
  private static readonly labels: Record<Environment, string> = {
    [Environment.PRODUCTION]: 'Producción',
  };

  private static readonly baseUrls: Record<Environment, string> = {
    [Environment.PRODUCTION]: 'https://panelcfdi.tecnofact.mx',
  };

  static isProduction(env: Environment): boolean {
    return env === Environment.PRODUCTION;
  }

  static getLabel(env: Environment): string {
    return this.labels[env];
  }

  static getBaseUrl(env: Environment): string {
    return this.baseUrls[env];
  }

  /**
   * Resuelve un Environment a partir de un string (p.ej. leído de variables
   * de entorno). Lanza si el valor no corresponde a un entorno soportado.
   */
  static fromValue(value: string): Environment {
    const normalized = value.trim().toLowerCase();
    if (normalized === Environment.PRODUCTION) {
      return Environment.PRODUCTION;
    }
    throw new Error(
      `Entorno inválido (invalid) o no soportado: "${value}". Entornos válidos: production.`
    );
  }
}
