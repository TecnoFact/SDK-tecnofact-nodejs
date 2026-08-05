import { TecnoFactException } from './TecnoFactException';

/**
 * Recurso no encontrado (HTTP 404).
 *
 * Firma PHP:
 *   public function __construct(string $message, ?string $requestId = null)
 */
export class NotFoundException extends TecnoFactException {
  constructor(message: string, requestId: string | null = null) {
    super(message, 0, null, requestId);
    this.name = 'NotFoundException';
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}
