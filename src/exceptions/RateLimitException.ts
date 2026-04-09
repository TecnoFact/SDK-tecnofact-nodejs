import { TecnoFactException } from './TecnoFactException';

export class RateLimitException extends TecnoFactException {
  constructor(message: string, code?: number, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'RateLimitException';
    Object.setPrototypeOf(this, RateLimitException.prototype);
  }
}
