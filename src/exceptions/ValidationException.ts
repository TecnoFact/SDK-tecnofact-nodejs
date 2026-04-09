import { TecnoFactException } from './TecnoFactException';

export class ValidationException extends TecnoFactException {
  constructor(message: string, code?: number, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'ValidationException';
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}
