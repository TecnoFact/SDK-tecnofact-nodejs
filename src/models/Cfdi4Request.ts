import { CfdiRelacionados } from './CfdiRelacionados';
import { Concepto } from './Concepto';
import { Emisor } from './Emisor';
import { Impuestos } from './Impuestos';
import { InformacionGlobal } from './InformacionGlobal';
import { Receptor } from './Receptor';

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
  fecha?: Date;
  condicionesDePago?: string;
  descuento?: number | string;
  tipoCambio?: number | string;
  confirmacion?: string;
  cfdiRelacionados?: CfdiRelacionados;
  exportacion?: string;
  informacionGlobal?: InformacionGlobal;
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
  private readonly fecha?: Date;
  private readonly condicionesDePago?: string;
  private readonly descuento?: number | string;
  private readonly tipoCambio?: number | string;
  private readonly confirmacion?: string;
  private readonly cfdiRelacionados?: CfdiRelacionados;
  private readonly exportacion?: string;
  private readonly informacionGlobal?: InformacionGlobal;

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
    this.confirmacion = data.confirmacion;
    this.cfdiRelacionados = data.cfdiRelacionados;
    this.exportacion = data.exportacion;
    this.informacionGlobal = data.informacionGlobal;
  }

  getEmisor(): Emisor {
    return this.emisor;
  }

  getReceptor(): Receptor {
    return this.receptor;
  }

  getConceptos(): Concepto[] {
    return this.conceptos;
  }

  getFormaPago(): string {
    return this.formaPago;
  }

  getMetodoPago(): string {
    return this.metodoPago;
  }

  getTipoComprobante(): string {
    return this.tipoComprobante;
  }

  getLugarExpedicion(): string {
    return this.lugarExpedicion;
  }

  getSubtotal(): number | string {
    return this.subtotal;
  }

  getTotal(): number | string {
    return this.total;
  }

  getFecha(): Date | null {
    return this.fecha ?? null;
  }

  getMoneda(): string {
    return this.moneda;
  }

  getSerie(): string | null {
    return this.serie ?? null;
  }

  getFolio(): string | null {
    return this.folio ?? null;
  }

  getTipoCambio(): number | string | null {
    return this.tipoCambio ?? null;
  }

  getImpuestos(): Impuestos | null {
    return this.impuestos ?? null;
  }

  getConfirmacion(): string | null {
    return this.confirmacion ?? null;
  }

  getCfdiRelacionados(): CfdiRelacionados | null {
    return this.cfdiRelacionados ?? null;
  }

  getExportacion(): string | null {
    return this.exportacion ?? null;
  }

  getCondicionesPago(): string | null {
    return this.condicionesDePago ?? null;
  }

  getDescuento(): number | string | null {
    return this.descuento ?? null;
  }

  getInformacionGlobal(): InformacionGlobal | null {
    return this.informacionGlobal ?? null;
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
      obj.fecha = this.fecha.toISOString();
    }
    if (this.condicionesDePago) {
      obj.condiciones_de_pago = this.condicionesDePago;
    }
    if (this.descuento !== undefined && this.descuento !== null) {
      obj.descuento = this.descuento;
    }
    if (this.tipoCambio !== undefined && this.tipoCambio !== null) {
      obj.tipo_cambio = this.tipoCambio;
    }
    if (this.confirmacion) {
      obj.confirmacion = this.confirmacion;
    }
    if (this.cfdiRelacionados) {
      obj.cfdi_relacionados = this.cfdiRelacionados.toObject();
    }
    if (this.exportacion) {
      obj.exportacion = this.exportacion;
    }
    if (this.informacionGlobal) {
      obj.informacion_global = this.informacionGlobal.toObject();
    }

    return obj;
  }
}
