export interface ParteData {
  claveProdServ: string;
  cantidad: number;
  descripcion: string;
  unidad?: string;
  noIdentificacion?: string;
  valorUnitario?: number;
  importe?: number;
}

export class Parte {
  private readonly claveProdServ: string;
  private readonly cantidad: number;
  private readonly descripcion: string;
  private readonly unidad?: string;
  private readonly noIdentificacion?: string;
  private readonly valorUnitario?: number;
  private readonly importe?: number;

  constructor(data: ParteData) {
    this.claveProdServ = data.claveProdServ;
    this.cantidad = data.cantidad;
    this.descripcion = data.descripcion;
    this.unidad = data.unidad;
    this.noIdentificacion = data.noIdentificacion;
    this.valorUnitario = data.valorUnitario;
    this.importe = data.importe;
  }

  getClaveProdServ(): string {
    return this.claveProdServ;
  }

  getCantidad(): number {
    return this.cantidad;
  }

  getDescripcion(): string {
    return this.descripcion;
  }

  getUnidad(): string | null {
    return this.unidad ?? null;
  }

  getNoIdentificacion(): string | null {
    return this.noIdentificacion ?? null;
  }

  getValorUnitario(): number | null {
    return this.valorUnitario ?? null;
  }

  getImporte(): number | null {
    return this.importe ?? null;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      clave_prod_serv: this.claveProdServ,
      cantidad: this.cantidad,
      descripcion: this.descripcion,
    };

    if (this.unidad) {
      obj.unidad = this.unidad;
    }
    if (this.noIdentificacion) {
      obj.no_identificacion = this.noIdentificacion;
    }
    if (this.valorUnitario !== null && this.valorUnitario !== undefined) {
      obj.valor_unitario = this.valorUnitario;
    }
    if (this.importe !== null && this.importe !== undefined) {
      obj.importe = this.importe;
    }

    return obj;
  }
}
