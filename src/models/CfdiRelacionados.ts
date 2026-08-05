export interface CfdiRelacionadosData {
  tipoRelacion: string;
  uuids: string[];
}

export class CfdiRelacionados {
  private readonly tipoRelacion: string;
  private readonly uuids: string[];

  constructor(data: CfdiRelacionadosData) {
    this.tipoRelacion = data.tipoRelacion;
    this.uuids = data.uuids;
  }

  getTipoRelacion(): string {
    return this.tipoRelacion;
  }

  getUuids(): string[] {
    return this.uuids;
  }

  toObject(): Record<string, unknown> {
    return {
      tipo_relacion: this.tipoRelacion,
      uuids: this.uuids,
    };
  }
}
