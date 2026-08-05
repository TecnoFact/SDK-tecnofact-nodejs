import { TecnoFactException } from './TecnoFactException';

/**
 * Error del lado del servidor (HTTP 5xx y otros no cubiertos).
 *
 * Firma PHP:
 *   public function __construct(string $message, int $statusCode = 500, ?string $requestId = null)
 */
export class ServerException extends TecnoFactException {
  private readonly statusCode: number;

  constructor(message: string, statusCode: number = 500, requestId: string | null = null) {
    super(message, 0, null, requestId);
    this.name = 'ServerException';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ServerException.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}
