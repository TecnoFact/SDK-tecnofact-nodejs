import { TecnoFactException } from './TecnoFactException';

/**
 * Errores de validación (HTTP 400 / 422).
 *
 * Firma PHP:
 *   public function __construct(string $message, array $errors = [], ?string $requestId = null)
 */
export class ValidationException extends TecnoFactException {
  private readonly errors: unknown[];

  constructor(message: string, errors: unknown[] = [], requestId: string | null = null) {
    super(message, 0, null, requestId);
    this.name = 'ValidationException';
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  getErrors(): unknown[] {
    return this.errors;
  }
}
