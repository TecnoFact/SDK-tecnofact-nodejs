export interface EmisorData {
  rfc: string;
  nombre: string;
  regimenFiscal: string;
  cp: string;
  facAtrAdm?: string;
}

export class Emisor {
  private readonly rfc: string;
  private readonly nombre: string;
  private readonly regimenFiscal: string;
  private readonly cp: string;
  private readonly facAtrAdm?: string;

  constructor(data: EmisorData) {
    this.rfc = data.rfc;
    this.nombre = data.nombre;
    this.regimenFiscal = data.regimenFiscal;
    this.cp = data.cp;
    this.facAtrAdm = data.facAtrAdm;
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

  getFacAtrAdm(): string | null {
    return this.facAtrAdm ?? null;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      rfc: this.rfc,
      nombre: this.nombre,
      regimen_fiscal: this.regimenFiscal,
      cp: this.cp,
    };

    if (this.facAtrAdm) {
      obj.facAtrAdm = this.facAtrAdm;
    }

    return obj;
  }
}
