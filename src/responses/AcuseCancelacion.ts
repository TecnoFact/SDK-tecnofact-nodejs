export type AcuseCancelacionRaw = Record<string, unknown>;

export class AcuseCancelacion {
  private readonly success: boolean;
  private readonly validado: boolean;
  private readonly uuid: string | null;
  private readonly statusSat: string | null;
  private readonly xml: string | null;
  private readonly pdfBase64: string | null;
  private readonly raw: Record<string, unknown>;

  private constructor(
    success: boolean,
    validado: boolean,
    uuid: string | null,
    statusSat: string | null,
    xml: string | null,
    pdfBase64: string | null,
    raw: Record<string, unknown>
  ) {
    this.success = success;
    this.validado = validado;
    this.uuid = uuid;
    this.statusSat = statusSat;
    this.xml = xml;
    this.pdfBase64 = pdfBase64;
    this.raw = raw;
  }

  static fromResponse(response: Record<string, unknown>): AcuseCancelacion {
    const data =
      response['data'] && typeof response['data'] === 'object'
        ? (response['data'] as Record<string, unknown>)
        : {};
    return new AcuseCancelacion(
      Boolean(response['success'] ?? false),
      Boolean(data['validado'] ?? false),
      AcuseCancelacion.asString(data['uuid']),
      AcuseCancelacion.asString(data['status_sat']),
      AcuseCancelacion.asString(data['xml']),
      AcuseCancelacion.asString(data['pdf']),
      response
    );
  }

  isSuccess(): boolean {
    return this.success;
  }

  isValidado(): boolean {
    return this.validado;
  }

  getUuid(): string | null {
    return this.uuid;
  }

  getStatusSat(): string | null {
    return this.statusSat;
  }

  isAceptadaPorSat(): boolean {
    return this.statusSat !== null && this.statusSat.startsWith('201');
  }

  getXml(): string | null {
    return this.xml;
  }

  getPdfBase64(): string | null {
    return this.pdfBase64;
  }

  getPdfBinario(): Buffer | null {
    if (this.pdfBase64 === null) {
      return null;
    }
    try {
      const buf = Buffer.from(this.pdfBase64, 'base64');
      return buf.toString('base64') === this.pdfBase64 ? buf : null;
    } catch {
      return null;
    }
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
