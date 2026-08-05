import { TecnoFactException } from './TecnoFactException';

/**
 * Falló de autenticación (HTTP 401).
 *
 * Firma PHP:
 *   public function __construct(string $message, ?string $requestId = null)
 */
export class AuthenticationException extends TecnoFactException {
  constructor(message: string, requestId: string | null = null) {
    super(message, 0, null, requestId);
    this.name = 'AuthenticationException';
    Object.setPrototypeOf(this, AuthenticationException.prototype);
  }
}
