import { ValidationException } from '../exceptions';
import { Config } from '../config';
import { IHttpClient } from '../contracts';
import { Service } from './Service';

/**
 * Servicio de reportes. Alineado a TecnoFact\Sdk\ReportesService.
 */
export class ReportesService extends Service {
  constructor(config: Config, httpClient: IHttpClient) {
    super(config, httpClient);
  }

  public async getResumen(fechaInicio: string, fechaFin: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(`${this.getBaseUrl()}/reportes/resumen`, this.getHeaders(), {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
    } catch (e) {
      throw new ValidationException(`Failed to get resumen: ${(e as Error).message}`);
    }
  }

  public async getVentas(
    fechaInicio: string | null = null,
    fechaFin: string | null = null
  ): Promise<Record<string, unknown>> {
    const queryParams: Record<string, unknown> = {};
    if (fechaInicio !== null) queryParams['fecha_inicio'] = fechaInicio;
    if (fechaFin !== null) queryParams['fecha_fin'] = fechaFin;
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/reportes/ventas`,
        this.getHeaders(),
        queryParams
      );
    } catch (e) {
      throw new ValidationException(`Failed to get ventas report: ${(e as Error).message}`);
    }
  }

  public async getCancelaciones(
    fechaInicio: string,
    fechaFin: string
  ): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/reportes/cancelaciones`,
        this.getHeaders(),
        { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
      );
    } catch (e) {
      throw new ValidationException(`Failed to get cancelaciones report: ${(e as Error).message}`);
    }
  }

  public async getXml(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/reportes/xml/${uuid}`,
        this.getHeaders()
      );
    } catch (e) {
      throw new ValidationException(`Failed to get XML report: ${(e as Error).message}`);
    }
  }

  public async getPdf(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/reportes/pdf/${uuid}`,
        this.getHeaders()
      );
    } catch (e) {
      throw new ValidationException(`Failed to get PDF report: ${(e as Error).message}`);
    }
  }

  public async exportarCsv(
    fechaInicio: string,
    fechaFin: string
  ): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/reportes/exportar`,
        this.getHeaders(),
        { fecha_inicio: fechaInicio, fecha_fin: fechaFin, formato: 'csv' }
      );
    } catch (e) {
      throw new ValidationException(`Failed to export CSV: ${(e as Error).message}`);
    }
  }

  public async exportarExcel(
    fechaInicio: string,
    fechaFin: string
  ): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/reportes/exportar`,
        this.getHeaders(),
        { fecha_inicio: fechaInicio, fecha_fin: fechaFin, formato: 'xlsx' }
      );
    } catch (e) {
      throw new ValidationException(`Failed to export Excel: ${(e as Error).message}`);
    }
  }
}
