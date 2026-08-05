export interface InformacionGlobalData {
  periodicidad: string;
  meses: string;
  anio: string;
}

export class InformacionGlobal {
  private readonly periodicidad: string;
  private readonly meses: string;
  private readonly anio: string;

  constructor(data: InformacionGlobalData) {
    this.periodicidad = data.periodicidad;
    this.meses = data.meses;
    this.anio = data.anio;
  }

  getPeriodicidad(): string {
    return this.periodicidad;
  }

  getMeses(): string {
    return this.meses;
  }

  getAnio(): string {
    return this.anio;
  }

  toObject(): Record<string, unknown> {
    return {
      periodicidad: this.periodicidad,
      meses: this.meses,
      anio: this.anio,
    };
  }
}
