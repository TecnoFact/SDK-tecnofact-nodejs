/**
 * Excepción base del SDK de TecnoFact.
 *
 * Firma alineada a la contraparte PHP:
 *   public function __construct(
 *     string $message, int $code = 0, ?\Throwable $previous = null, ?string $requestId = null
 *   )
 */
export class TecnoFactException extends Error {
  public readonly code: number;
  /**
   * @deprecated Conservado por compatibilidad hacia atrás con pruebas/llamantes
   * existentes. La firma PHP no acepta `details` en el constructor; este campo
   * se mantiene inicializado en `{}` para no romper a quien lea `.details` o
   * llame a `getDetails()`. Las subclases con `errors` (p.ej. ValidationException)
   * devuelven ahí la información de validación.
   */
  public readonly details: Record<string, unknown> = {};

  private readonly previous: Error | null;
  private readonly requestId: string | null;

  constructor(
    message: string,
    code: number = 0,
    previous: Error | null = null,
    requestId: string | null = null
  ) {
    super(message);
    this.name = 'TecnoFactException';
    this.code = code;
    this.previous = previous;
    this.requestId = requestId;
    Object.setPrototypeOf(this, TecnoFactException.prototype);
  }

  getRequestId(): string | null {
    return this.requestId;
  }

  getPrevious(): Error | null {
    return this.previous;
  }

  toString(): string {
    if (this.code) {
      return `[${this.code}] ${this.message}`;
    }
    return this.message;
  }

  getDetails(): Record<string, unknown> {
    return this.details;
  }
}
