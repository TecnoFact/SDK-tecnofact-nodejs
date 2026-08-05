import { CuentaPredial } from './CuentaPredial';
import { ImpuestosConcepto } from './ImpuestosConcepto';
import { InformacionAduanera } from './InformacionAduanera';
import { Parte } from './Parte';

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
  cuentaPredial?: CuentaPredial;
  partes?: Parte[];
  informacionAduanera?: InformacionAduanera;
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
  private readonly cuentaPredial?: CuentaPredial;
  private readonly partes?: Parte[];
  private readonly informacionAduanera?: InformacionAduanera;

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
    this.cuentaPredial = data.cuentaPredial;
    this.partes = data.partes;
    this.informacionAduanera = data.informacionAduanera;
  }

  getClaveProdServ(): string {
    return this.claveProdServ;
  }

  getCantidad(): number | string {
    return this.cantidad;
  }

  getClaveUnidad(): string {
    return this.claveUnidad;
  }

  getUnidad(): string | null {
    return this.unidad ?? null;
  }

  getDescripcion(): string {
    return this.descripcion;
  }

  getValorUnitario(): number | string {
    return this.valorUnitario;
  }

  getImporte(): number | string {
    return this.importe;
  }

  getObjetoImp(): string {
    return this.objetoImp;
  }

  getImpuestos(): ImpuestosConcepto | null {
    return this.impuestos ?? null;
  }

  getNoIdentificacion(): string | null {
    return this.noIdentificacion ?? null;
  }

  getCuentaPredial(): CuentaPredial | null {
    return this.cuentaPredial ?? null;
  }

  getPartes(): Parte[] | null {
    return this.partes ?? null;
  }

  getInformacionAduanera(): InformacionAduanera | null {
    return this.informacionAduanera ?? null;
  }

  getDescuento(): number | string | null {
    return this.descuento ?? null;
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
    if (this.cuentaPredial) {
      obj.cuenta_predial = this.cuentaPredial.toObject();
    }
    if (this.partes) {
      obj.partes = this.partes.map((p) => p.toObject());
    }
    if (this.informacionAduanera) {
      obj.informacion_aduanera = this.informacionAduanera.toObject();
    }

    return obj;
  }
}
