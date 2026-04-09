export interface EmisorData {
  rfc: string;
  nombre: string;
  regimenFiscal: string;
  cp: string;
}

export class Emisor {
  private readonly rfc: string;
  private readonly nombre: string;
  private readonly regimenFiscal: string;
  private readonly cp: string;

  constructor(data: EmisorData) {
    this.rfc = data.rfc;
    this.nombre = data.nombre;
    this.regimenFiscal = data.regimenFiscal;
    this.cp = data.cp;
  }

  getRfc(): string {
    return this.rfc;
  }

  getNombre(): string {
    return this.nombre;
  }

  getRegimenFiscal(): string {
    return this.regimenFiscal;
  }

  getCp(): string {
    return this.cp;
  }

  toObject(): Record<string, unknown> {
    return {
      rfc: this.rfc,
      nombre: this.nombre,
      regimen_fiscal: this.regimenFiscal,
      cp: this.cp,
    };
  }
}
