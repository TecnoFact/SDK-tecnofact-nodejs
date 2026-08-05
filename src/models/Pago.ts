import { DoctoRelacionado } from './DoctoRelacionado';

export interface PagoData {
  fechaPago: Date;
  formaDePagoP: string;
  monedaP: string;
  monto: string;
  doctosRelacionados: DoctoRelacionado[];
  tipoCambioP?: string;
}

export class Pago {
  private readonly fechaPago: Date;
  private readonly formaDePagoP: string;
  private readonly monedaP: string;
  private readonly monto: string;
  private readonly doctosRelacionados: DoctoRelacionado[];
  private readonly tipoCambioP: string;

  constructor(data: PagoData) {
    this.fechaPago = data.fechaPago;
    this.formaDePagoP = data.formaDePagoP;
    this.monedaP = data.monedaP;
    this.monto = data.monto;
    this.doctosRelacionados = data.doctosRelacionados;
    this.tipoCambioP = data.tipoCambioP ?? '1';
  }

  getFechaPago(): Date {
    return this.fechaPago;
  }

  getFormaDePagoP(): string {
    return this.formaDePagoP;
  }

  getMonedaP(): string {
    return this.monedaP;
  }

  getMonto(): string {
    return this.monto;
  }

  getTipoCambioP(): string {
    return this.tipoCambioP;
  }

  getDoctosRelacionados(): DoctoRelacionado[] {
    return this.doctosRelacionados;
  }

  toObject(): Record<string, unknown> {
    return {
      fecha_pago: this.fechaPago.toISOString(),
      forma_de_pago_p: this.formaDePagoP,
      moneda_p: this.monedaP,
      monto: this.monto,
      tipo_cambio_p: this.tipoCambioP,
      doctos_relacionados: this.doctosRelacionados.map((d) => d.toObject()),
    };
  }
}
