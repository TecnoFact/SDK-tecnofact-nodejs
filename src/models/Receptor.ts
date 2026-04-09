export interface ReceptorData {
  rfc: string;
  nombre: string;
  usoCfdi: string;
  domicilioFiscalReceptor: string;
  regimenFiscalReceptor: string;
  residenciaFiscal?: string;
  numRegIdTrib?: string;
}

export class Receptor {
  private readonly rfc: string;
  private readonly nombre: string;
  private readonly usoCfdi: string;
  private readonly domicilioFiscalReceptor: string;
  private readonly regimenFiscalReceptor: string;
  private readonly residenciaFiscal?: string;
  private readonly numRegIdTrib?: string;

  constructor(data: ReceptorData) {
    this.rfc = data.rfc;
    this.nombre = data.nombre;
    this.usoCfdi = data.usoCfdi;
    this.domicilioFiscalReceptor = data.domicilioFiscalReceptor;
    this.regimenFiscalReceptor = data.regimenFiscalReceptor;
    this.residenciaFiscal = data.residenciaFiscal;
    this.numRegIdTrib = data.numRegIdTrib;
  }

  getRfc(): string {
    return this.rfc;
  }

  getNombre(): string {
    return this.nombre;
  }

  getUsoCfdi(): string {
    return this.usoCfdi;
  }

  toObject(): Record<string, unknown> {
    const obj: Record<string, unknown> = {
      rfc: this.rfc,
      nombre: this.nombre,
      uso_cfdi: this.usoCfdi,
      domicilio_fiscal_receptor: this.domicilioFiscalReceptor,
      regimen_fiscal_receptor: this.regimenFiscalReceptor,
    };

    if (this.residenciaFiscal) {
      obj.residencia_fiscal = this.residenciaFiscal;
    }
    if (this.numRegIdTrib) {
      obj.num_reg_id_trib = this.numRegIdTrib;
    }

    return obj;
  }
}
