import { TecnoFactException } from './TecnoFactException';

export class ServerException extends TecnoFactException {
  constructor(message: string, code?: number, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'ServerException';
    Object.setPrototypeOf(this, ServerException.prototype);
  }
}
