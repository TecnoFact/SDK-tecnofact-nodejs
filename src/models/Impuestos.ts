import { RetencionGlobal } from './RetencionGlobal';
import { TrasladoGlobal } from './TrasladoGlobal';

export interface ImpuestosData {
  totalImpuestosTrasladados?: number | string;
  totalImpuestosRetenidos?: number | string;
  traslados?: TrasladoGlobal[];
  retenciones?: RetencionGlobal[];
}

export class Impuestos {
  private readonly totalImpuestosTrasladados?: number | string;
  private readonly totalImpuestosRetenidos?: number | string;
  private readonly traslados?: TrasladoGlobal[];
  private readonly retenciones?: RetencionGlobal[];

  constructor(data: ImpuestosData) {
    this.totalImpuestosTrasladados = data.totalImpuestosTrasladados;
    this.totalImpuestosRetenidos = data.totalImpuestosRetenidos;
    this.traslados = data.traslados;
    this.retenciones = data.retenciones;
  }

  getTotalImpuestosRetenidos(): number | string | null {
    return this.totalImpuestosRetenidos ?? null;
  }

  getTotalImpuestosTrasladados(): number | string | null {
    return this.totalImpuestosTrasladados ?? null;
  }

  getTraslados(): TrasladoGlobal[] | null {
    return this.traslados ?? null;
  }

  getRetenciones(): RetencionGlobal[] | null {
    return this.retenciones ?? null;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {};

    if (this.totalImpuestosTrasladados !== undefined) {
      obj.total_impuestos_trasladados = this.totalImpuestosTrasladados;
    }
    if (this.totalImpuestosRetenidos !== undefined) {
      obj.total_impuestos_retenidos = this.totalImpuestosRetenidos;
    }
    if (this.traslados && this.traslados.length > 0) {
      obj.traslados = this.traslados.map((t) => t.toObject());
    }
    if (this.retenciones && this.retenciones.length > 0) {
      obj.retenciones = this.retenciones.map((r) => r.toObject());
    }

    return obj;
  }
}
