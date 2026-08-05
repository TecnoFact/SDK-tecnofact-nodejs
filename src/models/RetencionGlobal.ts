export interface RetencionGlobalData {
  impuesto: string;
  importe: number | string;
}

export class RetencionGlobal {
  private readonly impuesto: string;
  private readonly importe: number | string;

  constructor(data: RetencionGlobalData) {
    this.impuesto = data.impuesto;
    this.importe = data.importe;
  }

  getImpuesto(): string {
    return this.impuesto;
  }

  getImporte(): number | string {
    return this.importe;
  }

  toObject(): Record<string, unknown> {
    return {
      impuesto: this.impuesto,
      importe: this.importe,
    };
  }
}
