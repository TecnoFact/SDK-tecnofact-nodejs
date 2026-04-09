import { ImpuestosConcepto } from './ImpuestosConcepto';

export interface ConceptoData {
  claveProdServ: string;
  cantidad: number | string;
  claveUnidad: string;
  descripcion: string;
  valorUnitario: number | string;
  importe: number | string;
  objetoImp: string;
  impuestos?: ImpuestosConcepto;
  noIdentificacion?: string;
  unidad?: string;
  descuento?: number | string;
}

export class Concepto {
  private readonly claveProdServ: string;
  private readonly cantidad: number | string;
  private readonly claveUnidad: string;
  private readonly descripcion: string;
  private readonly valorUnitario: number | string;
  private readonly importe: number | string;
  private readonly objetoImp: string;
  private readonly impuestos?: ImpuestosConcepto;
  private readonly noIdentificacion?: string;
  private readonly unidad?: string;
  private readonly descuento?: number | string;

  constructor(data: ConceptoData) {
    this.claveProdServ = data.claveProdServ;
    this.cantidad = data.cantidad;
    this.claveUnidad = data.claveUnidad;
    this.descripcion = data.descripcion;
    this.valorUnitario = data.valorUnitario;
    this.importe = data.importe;
    this.objetoImp = data.objetoImp;
    this.impuestos = data.impuestos;
    this.noIdentificacion = data.noIdentificacion;
    this.unidad = data.unidad;
    this.descuento = data.descuento;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      clave_prod_serv: this.claveProdServ,
      cantidad: this.cantidad,
      clave_unidad: this.claveUnidad,
      descripcion: this.descripcion,
      valor_unitario: this.valorUnitario,
      importe: this.importe,
      objeto_imp: this.objetoImp,
    };

    if (this.impuestos) {
      obj.impuestos = this.impuestos.toObject();
    }
    if (this.noIdentificacion) {
      obj.no_identificacion = this.noIdentificacion;
    }
    if (this.unidad) {
      obj.unidad = this.unidad;
    }
    if (this.descuento) {
      obj.descuento = this.descuento;
    }

    return obj;
  }
}
