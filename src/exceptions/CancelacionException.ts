import { TecnoFactException } from './TecnoFactException';

export class CancelacionException extends TecnoFactException {
  constructor(message: string, code?: number, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'CancelacionException';
    Object.setPrototypeOf(this, CancelacionException.prototype);
  }
}
