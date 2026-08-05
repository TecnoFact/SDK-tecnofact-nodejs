import { ValidationException } from '../exceptions';
import { Config } from '../config';
import { IHttpClient } from '../contracts';
import { Service } from './Service';

/**
 * Servicio de validaciones y catálogos. Alineado a TecnoFact\Sdk\ValidacionesService.
 *
 * `validarXml` envía el XML codificado en base64 (equivalente a `base64_encode`
 * en PHP) usando `Buffer.from(xml, 'utf8').toString('base64')`.
 */
export class ValidacionesService extends Service {
  constructor(config: Config, httpClient: IHttpClient) {
    super(config, httpClient);
  }

  public async validarXml(xml: string): Promise<Record<string, unknown>> {
    try {
      const encoded = Buffer.from(xml, 'utf8').toString('base64');
      return await this.httpClient.post(
        `${this.getBaseUrl()}/validaciones/xml`,
        this.getHeaders(),
        { xml: encoded }
      );
    } catch (e) {
      throw new ValidationException(`Failed to validate XML: ${(e as Error).message}`);
    }
  }

  public async validarRfc(rfc: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/validaciones/rfc/${rfc}`,
        this.getHeaders()
      );
    } catch (e) {
      throw new ValidationException(`Failed to validate RFC: ${(e as Error).message}`);
    }
  }

  public async validarNoCertificado(noCertificado: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/validaciones/certificado/${noCertificado}`,
        this.getHeaders()
      );
    } catch (e) {
      throw new ValidationException(`Failed to validate certificate: ${(e as Error).message}`);
    }
  }

  public async getCatalogos(): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/validaciones/catalogos`,
        this.getHeaders()
      );
    } catch (e) {
      throw new ValidationException(`Failed to get catalogos: ${(e as Error).message}`);
    }
  }

  public async getUnidadesMedida(): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/validaciones/catalogos/unidades`,
        this.getHeaders()
      );
    } catch (e) {
      throw new ValidationException(`Failed to get unidades de medida: ${(e as Error).message}`);
    }
  }

  public async getProductosServicios(): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/validaciones/catalogos/productos`,
        this.getHeaders()
      );
    } catch (e) {
      throw new ValidationException(`Failed to get productos y servicios: ${(e as Error).message}`);
    }
  }

  public async getImpuestos(): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/validaciones/catalogos/impuestos`,
        this.getHeaders()
      );
    } catch (e) {
      throw new ValidationException(`Failed to get impuestos: ${(e as Error).message}`);
    }
  }
}
