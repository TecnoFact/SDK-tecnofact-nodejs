import { CancelacionException } from '../exceptions';
import { AcuseCancelacion } from '../responses';
import { Config } from '../config';
import { IHttpClient } from '../contracts';
import { Service } from './Service';

/**
 * Servicio de cancelación de CFDI. Alineado a TecnoFact\Sdk\CancelacionService.
 */
export class CancelacionService extends Service {
  constructor(config: Config, httpClient: IHttpClient) {
    super(config, httpClient);
  }

  public async cancelar(rfc: string, uuid: string, motivo: string): Promise<AcuseCancelacion> {
    try {
      const response = await this.httpClient.post(
        `${this.getBaseUrl()}/api/v1/cancelled-cfdi`,
        this.getHeaders(),
        { rfc, uuid, motivo }
      );
      return AcuseCancelacion.fromResponse(response);
    } catch (e) {
      throw new CancelacionException(`Failed to cancel CFDI: ${(e as Error).message}`);
    }
  }

  public async getStatus(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/cancelacion/${uuid}/status`,
        this.getHeaders()
      );
    } catch (e) {
      throw new CancelacionException(`Failed to get cancellation status: ${(e as Error).message}`);
    }
  }

  public async obtenerAcuse(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/cancelacion/${uuid}/acuse`,
        this.getHeaders()
      );
    } catch (e) {
      throw new CancelacionException(`Failed to get acuse: ${(e as Error).message}`);
    }
  }

  public async getPending(): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/cancelacion/pendientes`,
        this.getHeaders()
      );
    } catch (e) {
      throw new CancelacionException(
        `Failed to get pending cancellations: ${(e as Error).message}`
      );
    }
  }
}
