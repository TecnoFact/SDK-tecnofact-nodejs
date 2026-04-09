import { Emisor } from './Emisor';
import { Receptor } from './Receptor';
import { Concepto } from './Concepto';
import { Impuestos } from './Impuestos';

export interface Cfdi4RequestData {
  emisor: Emisor;
  receptor: Receptor;
  conceptos: Concepto[];
  tipoComprobante: string;
  formaPago: string;
  metodoPago: string;
  moneda: string;
  subtotal: number | string;
  total: number | string;
  lugarExpedicion: string;
  impuestos?: Impuestos;
  serie?: string;
  folio?: string;
  fecha?: string;
  condicionesDePago?: string;
  descuento?: number | string;
  tipoCambio?: number | string;
}

export class Cfdi4Request {
  private readonly emisor: Emisor;
  private readonly receptor: Receptor;
  private readonly conceptos: Concepto[];
  private readonly tipoComprobante: string;
  private readonly formaPago: string;
  private readonly metodoPago: string;
  private readonly moneda: string;
  private readonly subtotal: number | string;
  private readonly total: number | string;
  private readonly lugarExpedicion: string;
  private readonly impuestos?: Impuestos;
  private readonly serie?: string;
  private readonly folio?: string;
  private readonly fecha?: string;
  private readonly condicionesDePago?: string;
  private readonly descuento?: number | string;
  private readonly tipoCambio?: number | string;

  constructor(data: Cfdi4RequestData) {
    this.emisor = data.emisor;
    this.receptor = data.receptor;
    this.conceptos = data.conceptos;
    this.tipoComprobante = data.tipoComprobante;
    this.formaPago = data.formaPago;
    this.metodoPago = data.metodoPago;
    this.moneda = data.moneda;
    this.subtotal = data.subtotal;
    this.total = data.total;
    this.lugarExpedicion = data.lugarExpedicion;
    this.impuestos = data.impuestos;
    this.serie = data.serie;
    this.folio = data.folio;
    this.fecha = data.fecha;
    this.condicionesDePago = data.condicionesDePago;
    this.descuento = data.descuento;
    this.tipoCambio = data.tipoCambio;
  }

  getSubtotal(): number | string {
    return this.subtotal;
  }

  getTotal(): number | string {
    return this.total;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      emisor: this.emisor.toObject(),
      receptor: this.receptor.toObject(),
      conceptos: this.conceptos.map((c) => c.toObject()),
      tipo_comprobante: this.tipoComprobante,
      forma_pago: this.formaPago,
      metodo_pago: this.metodoPago,
      moneda: this.moneda,
      subtotal: this.subtotal,
      total: this.total,
      lugar_expedicion: this.lugarExpedicion,
    };

    if (this.impuestos) {
      obj.impuestos = this.impuestos.toObject();
    }
    if (this.serie) {
      obj.serie = this.serie;
    }
    if (this.folio) {
      obj.folio = this.folio;
    }
    if (this.fecha) {
      obj.fecha = this.fecha;
    }
    if (this.condicionesDePago) {
      obj.condiciones_de_pago = this.condicionesDePago;
    }
    if (this.descuento) {
      obj.descuento = this.descuento;
    }
    if (this.tipoCambio) {
      obj.tipo_cambio = this.tipoCambio;
    }

    return obj;
  }
}
