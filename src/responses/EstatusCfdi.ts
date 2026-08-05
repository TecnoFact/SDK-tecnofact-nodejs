export type EstatusCfdiRaw = Record<string, unknown>;

export class EstatusCfdi {
  private readonly success: boolean;
  private readonly estado: string | null;
  private readonly codigo: string | null;
  private readonly esCancelable: string | null;
  private readonly estatusCancelacion: string | null;
  private readonly efos: string | null;
  private readonly raw: Record<string, unknown>;

  private constructor(
    success: boolean,
    estado: string | null,
    codigo: string | null,
    esCancelable: string | null,
    estatusCancelacion: string | null,
    efos: string | null,
    raw: Record<string, unknown>
  ) {
    this.success = success;
    this.estado = estado;
    this.codigo = codigo;
    this.esCancelable = esCancelable;
    this.estatusCancelacion = estatusCancelacion;
    this.efos = efos;
    this.raw = raw;
  }

  static fromResponse(response: Record<string, unknown>): EstatusCfdi {
    const data =
      response['data'] && typeof response['data'] === 'object'
        ? (response['data'] as Record<string, unknown>)
        : {};
    return new EstatusCfdi(
      Boolean(response['success'] ?? false),
      EstatusCfdi.asString(data['estado']),
      EstatusCfdi.asString(data['codigo']),
      EstatusCfdi.asString(data['es_cancellable']),
      EstatusCfdi.asString(data['estatus_cancelacion']),
      EstatusCfdi.asString(data['efos']),
      response
    );
  }

  isSuccess(): boolean {
    return this.success;
  }

  getEstado(): string | null {
    return this.estado;
  }

  isVigente(): boolean {
    return this.estado !== null && this.estado.toLowerCase() === 'vigente';
  }

  getCodigo(): string | null {
    return this.codigo;
  }

  getEsCancelable(): string | null {
    return this.esCancelable;
  }

  getEstatusCancelacion(): string | null {
    return this.estatusCancelacion;
  }

  getEfos(): string | null {
    return this.efos;
  }

  getRaw(): Record<string, unknown> {
    return this.raw;
  }

  private static asString(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }
    return value !== null && (typeof value === 'number' || typeof value === 'boolean')
      ? String(value)
      : null;
  }
}
