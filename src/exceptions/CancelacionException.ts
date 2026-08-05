import { TecnoFactException } from './TecnoFactException';

/**
 * Error específico del proceso de cancelación.
 *
 * Firma PHP:
 *   public function __construct(string $message, ?string $requestId = null)
 */
export class CancelacionException extends TecnoFactException {
  constructor(message: string, requestId: string | null = null) {
    super(message, 0, null, requestId);
    this.name = 'CancelacionException';
    Object.setPrototypeOf(this, CancelacionException.prototype);
  }
}
