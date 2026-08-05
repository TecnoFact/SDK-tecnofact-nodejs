import { TecnoFactException } from './TecnoFactException';

/**
 * Límite de peticiones excedido (HTTP 429).
 *
 * Firma PHP:
 *   public function __construct(string $message, int $retryAfter = 60, ?string $requestId = null)
 */
export class RateLimitException extends TecnoFactException {
  private readonly retryAfter: number;

  constructor(message: string, retryAfter: number = 60, requestId: string | null = null) {
    super(message, 0, null, requestId);
    this.name = 'RateLimitException';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, RateLimitException.prototype);
  }

  getRetryAfter(): number {
    return this.retryAfter;
  }
}
