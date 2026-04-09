export interface TrasladoGlobalData {
  impuesto: string;
  tipoFactor: string;
  tasaOCuota: number | string;
  importe: number | string;
}

export class TrasladoGlobal {
  private readonly impuesto: string;
  private readonly tipoFactor: string;
  private readonly tasaOCuota: number | string;
  private readonly importe: number | string;

  constructor(data: TrasladoGlobalData) {
    this.impuesto = data.impuesto;
    this.tipoFactor = data.tipoFactor;
    this.tasaOCuota = data.tasaOCuota;
    this.importe = data.importe;
  }

  toObject(): Record<string, unknown> {
    return {
      impuesto: this.impuesto,
      tipo_factor: this.tipoFactor,
      tasa_o_cuota: this.tasaOCuota,
      importe: this.importe,
    };
  }
}
