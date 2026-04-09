export interface TrasladoData {
  base: number | string;
  impuesto: string;
  tipoFactor: string;
  tasaOCuota: number | string;
  importe: number | string;
}

export class Traslado {
  private readonly base: number | string;
  private readonly impuesto: string;
  private readonly tipoFactor: string;
  private readonly tasaOCuota: number | string;
  private readonly importe: number | string;

  constructor(data: TrasladoData) {
    this.base = data.base;
    this.impuesto = data.impuesto;
    this.tipoFactor = data.tipoFactor;
    this.tasaOCuota = data.tasaOCuota;
    this.importe = data.importe;
  }

  toObject(): Record<string, unknown> {
    return {
      base: this.base,
      impuesto: this.impuesto,
      tipo_factor: this.tipoFactor,
      tasa_o_cuota: this.tasaOCuota,
      importe: this.importe,
    };
  }
}
