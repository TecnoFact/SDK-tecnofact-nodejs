export enum TipoComprobante {
  INGRESO = 'I',
  EGRESO = 'E',
  TRASLADO = 'T',
  NOMINA = 'N',
  PAGO = 'P',
}

export class TipoComprobanteHelper {
  private static readonly labels: Record<TipoComprobante, string> = {
    [TipoComprobante.INGRESO]: 'Ingreso',
    [TipoComprobante.EGRESO]: 'Egreso',
    [TipoComprobante.TRASLADO]: 'Traslado',
    [TipoComprobante.NOMINA]: 'Nómina',
    [TipoComprobante.PAGO]: 'Pago',
  };

  static getLabel(tipo: TipoComprobante): string {
    return this.labels[tipo];
  }
}
