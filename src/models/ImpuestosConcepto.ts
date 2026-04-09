import { Traslado } from './Traslado';
import { Retencion } from './Retencion';

export interface ImpuestosConceptoData {
  traslados?: Traslado[];
  retenciones?: Retencion[];
}

export class ImpuestosConcepto {
  private readonly traslados?: Traslado[];
  private readonly retenciones?: Retencion[];

  constructor(data: ImpuestosConceptoData) {
    this.traslados = data.traslados;
    this.retenciones = data.retenciones;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {};

    if (this.traslados && this.traslados.length > 0) {
      obj.traslados = this.traslados.map((t) => t.toObject());
    }
    if (this.retenciones && this.retenciones.length > 0) {
      obj.retenciones = this.retenciones.map((r) => r.toObject());
    }

    return obj;
  }
}
