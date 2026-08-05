export interface TrasladoGlobalData {
  base?: number | string;
  impuesto: string;
  tipoFactor: string;
  tasaOCuota?: number | string;
  importe?: number | string;
}

export class TrasladoGlobal {
  private readonly base?: number | string;
  private readonly impuesto: string;
  private readonly tipoFactor: string;
  private readonly tasaOCuota?: number | string;
  private readonly importe?: number | string;

  constructor(data: TrasladoGlobalData) {
    this.base = data.base;
    this.impuesto = data.impuesto;
    this.tipoFactor = data.tipoFactor;
    this.tasaOCuota = data.tasaOCuota;
    this.importe = data.importe;
  }

  getBase(): number | string | null {
    return this.base ?? null;
  }

  getImpuesto(): string {
    return this.impuesto;
  }

  getTipoFactor(): string {
    return this.tipoFactor;
  }

  getTasaOCuota(): number | string | null {
    return this.tasaOCuota ?? null;
  }

  getImporte(): number | string | null {
    return this.importe ?? null;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      impuesto: this.impuesto,
      tipo_factor: this.tipoFactor,
      tasa_o_cuota: this.tasaOCuota,
      importe: this.importe,
    };

    if (this.base !== undefined && this.base !== null) {
      obj.base = this.base;
    }

    return obj;
  }
}
