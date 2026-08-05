export interface DoctoRelacionadoData {
  idDocumento: string;
  monedaDR: string;
  equivalenciaDR: string;
  numParcialidad: number;
  impSaldoAnt: string;
  impPagado: string;
  impSaldoInsoluto: string;
  objetoImpDR: string;
  serie?: string;
  folio?: string;
}

export class DoctoRelacionado {
  private readonly idDocumento: string;
  private readonly monedaDR: string;
  private readonly equivalenciaDR: string;
  private readonly numParcialidad: number;
  private readonly impSaldoAnt: string;
  private readonly impPagado: string;
  private readonly impSaldoInsoluto: string;
  private readonly objetoImpDR: string;
  private readonly serie?: string;
  private readonly folio?: string;

  constructor(data: DoctoRelacionadoData) {
    this.idDocumento = data.idDocumento;
    this.monedaDR = data.monedaDR;
    this.equivalenciaDR = data.equivalenciaDR;
    this.numParcialidad = data.numParcialidad;
    this.impSaldoAnt = data.impSaldoAnt;
    this.impPagado = data.impPagado;
    this.impSaldoInsoluto = data.impSaldoInsoluto;
    this.objetoImpDR = data.objetoImpDR;
    this.serie = data.serie;
    this.folio = data.folio;
  }

  getIdDocumento(): string {
    return this.idDocumento;
  }

  getMonedaDR(): string {
    return this.monedaDR;
  }

  getEquivalenciaDR(): string {
    return this.equivalenciaDR;
  }

  getNumParcialidad(): number {
    return this.numParcialidad;
  }

  getImpSaldoAnt(): string {
    return this.impSaldoAnt;
  }

  getImpPagado(): string {
    return this.impPagado;
  }

  getImpSaldoInsoluto(): string {
    return this.impSaldoInsoluto;
  }

  getObjetoImpDR(): string {
    return this.objetoImpDR;
  }

  getSerie(): string | null {
    return this.serie ?? null;
  }

  getFolio(): string | null {
    return this.folio ?? null;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      id_documento: this.idDocumento,
      moneda_dr: this.monedaDR,
      equivalencia_dr: this.equivalenciaDR,
      num_parcialidad: this.numParcialidad,
      imp_saldo_ant: this.impSaldoAnt,
      imp_pagado: this.impPagado,
      imp_saldo_insoluto: this.impSaldoInsoluto,
      objeto_imp_dr: this.objetoImpDR,
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
