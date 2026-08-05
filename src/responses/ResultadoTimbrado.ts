export type ResultadoTimbradoRaw = Record<string, unknown>;

function pickFrom(
  response: Record<string, unknown>,
  data: Record<string, unknown>,
  keys: string[]
): unknown {
  for (const k of keys) {
    if (k in response && response[k] != null) {
      return response[k];
    }
    if (k in data && data[k] != null) {
      return data[k];
    }
  }
  return null;
}

export class ResultadoTimbrado {
  private readonly success: boolean;
  private readonly code: number | null;
  private readonly message: string | null;
  private readonly xmlTimbrado: string | null;
  private readonly uuid: string | null;
  private readonly raw: Record<string, unknown>;

  private constructor(
    success: boolean,
    code: number | null,
    message: string | null,
    xmlTimbrado: string | null,
    uuid: string | null,
    raw: Record<string, unknown>
  ) {
    this.success = success;
    this.code = code;
    this.message = message;
    this.xmlTimbrado = xmlTimbrado;
    this.uuid = uuid;
    this.raw = raw;
  }

  static fromResponse(response: Record<string, unknown>): ResultadoTimbrado {
    const data =
      response['data'] && typeof response['data'] === 'object'
        ? (response['data'] as Record<string, unknown>)
        : {};

    const xml = pickFrom(response, data, ['xml_timbrado', 'xml']);
    const uuid = pickFrom(response, data, ['uuid']);
    const message = pickFrom(response, data, ['message', 'error']);
    const codeRaw = response['code'] ?? null;
    const code: number | null =
      typeof codeRaw === 'number'
        ? codeRaw
        : typeof codeRaw === 'string' && codeRaw.trim() !== '' && Number.isFinite(Number(codeRaw))
          ? Number(codeRaw)
          : null;

    return new ResultadoTimbrado(
      Boolean(response['success'] ?? false),
      code,
      ResultadoTimbrado.asString(message),
      ResultadoTimbrado.asString(xml),
      ResultadoTimbrado.asString(uuid),
      response
    );
  }

  isSuccess(): boolean {
    return this.success;
  }

  getCode(): number | null {
    return this.code;
  }

  getMessage(): string | null {
    return this.message;
  }

  getXmlTimbrado(): string | null {
    return this.xmlTimbrado;
  }

  getUuid(): string | null {
    return this.uuid;
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
