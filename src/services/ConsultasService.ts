import { NotFoundException } from '../exceptions';
import { Config } from '../config';
import { IHttpClient } from '../contracts';
import { Service } from './Service';

/**
 * Servicio de consultas de CFDI. Alineado a TecnoFact\Sdk\ConsultasService.
 */
export class ConsultasService extends Service {
  constructor(config: Config, httpClient: IHttpClient) {
    super(config, httpClient);
  }

  public async buscarPorUuid(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/consultas/uuid/${uuid}`,
        this.getHeaders()
      );
    } catch (e) {
      throw new NotFoundException(`CFDI not found: ${(e as Error).message}`);
    }
  }

  public async buscarPorRfc(
    rfc: string,
    fechaInicio: string | null = null,
    fechaFin: string | null = null
  ): Promise<Record<string, unknown>> {
    const queryParams: Record<string, unknown> = {};
    if (fechaInicio !== null) queryParams['fecha_inicio'] = fechaInicio;
    if (fechaFin !== null) queryParams['fecha_fin'] = fechaFin;
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/consultas/rfc/${rfc}`,
        this.getHeaders(),
        queryParams
      );
    } catch (e) {
      throw new NotFoundException(`Failed to search by RFC: ${(e as Error).message}`);
    }
  }

  public async buscarPorSerie(serie: string, folio: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/consultas/serie/${serie}/folio/${folio}`,
        this.getHeaders()
      );
    } catch (e) {
      throw new NotFoundException(`CFDI not found by serie/folio: ${(e as Error).message}`);
    }
  }

  public async verificarSat(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/consultas/sat/${uuid}`,
        this.getHeaders()
      );
    } catch (e) {
      throw new NotFoundException(`SAT verification failed: ${(e as Error).message}`);
    }
  }

  public async listar(page: number = 1, perPage: number = 20): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(`${this.getBaseUrl()}/consultas`, this.getHeaders(), {
        page,
        per_page: perPage,
      });
    } catch (e) {
      throw new NotFoundException(`Failed to list CFDIs: ${(e as Error).message}`);
    }
  }
}
