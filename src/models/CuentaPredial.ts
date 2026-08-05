export interface CuentaPredialData {
  numero: string;
}

export class CuentaPredial {
  private readonly numero: string;

  constructor(data: CuentaPredialData) {
    this.numero = data.numero;
  }

  getNumero(): string {
    return this.numero;
  }

  toObject(): Record<string, unknown> {
    return {
      numero: this.numero,
    };
  }
}
