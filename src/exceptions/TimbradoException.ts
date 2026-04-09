import { TecnoFactException } from './TecnoFactException';

export class TimbradoException extends TecnoFactException {
  constructor(message: string, code?: number, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'TimbradoException';
    Object.setPrototypeOf(this, TimbradoException.prototype);
  }
}
