import { Emisor } from './Emisor';
import { Receptor } from './Receptor';
import { Pago } from './Pago';

export interface PagoRequestData {
  emisor: Emisor;
  receptor: Receptor;
  pagos: Pago[];
  fecha: Date;
  lugarExpedicion: string;
  serie?: string;
  folio?: string;
  exportacion?: string;
}

export class PagoRequest {
  private readonly emisor: Emisor;
  private readonly receptor: Receptor;
  private readonly pagos: Pago[];
  private readonly fecha: Date;
  private readonly lugarExpedicion: string;
  private readonly serie?: string;
  private readonly folio?: string;
  private readonly exportacion: string;

  constructor(data: PagoRequestData) {
    this.emisor = data.emisor;
    this.receptor = data.receptor;
    this.pagos = data.pagos;
    this.fecha = data.fecha;
    this.lugarExpedicion = data.lugarExpedicion;
    this.serie = data.serie;
    this.folio = data.folio;
    this.exportacion = data.exportacion ?? '01';
  }

  getEmisor(): Emisor {
    return this.emisor;
  }

  getReceptor(): Receptor {
    return this.receptor;
  }

  getPagos(): Pago[] {
    return this.pagos;
  }

  getFecha(): Date {
    return this.fecha;
  }

  getLugarExpedicion(): string {
    return this.lugarExpedicion;
  }

  getSerie(): string | null {
    return this.serie ?? null;
  }

  getFolio(): string | null {
    return this.folio ?? null;
  }

  getExportacion(): string {
    return this.exportacion;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      emisor: this.emisor.toObject(),
      receptor: this.receptor.toObject(),
      pagos: this.pagos.map((p) => p.toObject()),
      fecha: this.fecha.toISOString(),
      lugar_expedicion: this.lugarExpedicion,
      exportacion: this.exportacion,
    };

    if (this.serie) {
      obj.serie = this.serie;
    }
    if (this.folio) {
      obj.folio = this.folio;
    }

    return obj;
  }
}
