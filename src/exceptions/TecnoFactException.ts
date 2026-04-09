export class TecnoFactException extends Error {
  public readonly code?: number;
  public readonly details: Record<string, unknown>;

  constructor(message: string, code?: number, details?: Record<string, unknown>) {
    super(message);
    this.name = 'TecnoFactException';
    this.code = code;
    this.details = details || {};
    Object.setPrototypeOf(this, TecnoFactException.prototype);
  }

  toString(): string {
    if (this.code) {
      return `[${this.code}] ${this.message}`;
    }
    return this.message;
  }

  getDetails(): Record<string, unknown> {
    return this.details;
  }
}
