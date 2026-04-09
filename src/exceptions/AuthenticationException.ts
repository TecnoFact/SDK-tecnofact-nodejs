import { TecnoFactException } from './TecnoFactException';

export class AuthenticationException extends TecnoFactException {
  constructor(message: string, code?: number, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'AuthenticationException';
    Object.setPrototypeOf(this, AuthenticationException.prototype);
  }
}
