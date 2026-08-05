export interface InformacionAduaneraData {
  numeroPedimento: string;
}

export class InformacionAduanera {
  private readonly numeroPedimento: string;

  constructor(data: InformacionAduaneraData) {
    this.numeroPedimento = data.numeroPedimento;
  }

  getNumeroPedimento(): string {
    return this.numeroPedimento;
  }

  toObject(): Record<string, unknown> {
    return {
      numero_pedimento: this.numeroPedimento,
    };
  }
}
