import { TecnoFactException } from './TecnoFactException';

/**
 * Error específico del proceso de timbrado.
 *
 * Firma PHP:
 *   public function __construct(string $message, ?string $requestId = null)
 */
export class TimbradoException extends TecnoFactException {
  constructor(message: string, requestId: string | null = null) {
    super(message, 0, null, requestId);
    this.name = 'TimbradoException';
    Object.setPrototypeOf(this, TimbradoException.prototype);
  }
}
