import { TecnoFactException, TimbradoException } from '../exceptions';
import { Cfdi4Request, PagoRequest } from '../models';
import { Config } from '../config';
import { IHttpClient } from '../contracts';
import { CfdiXmlBuilder } from '../xml';
import { EstatusCfdi, ResultadoTimbrado } from '../responses';
import { Service } from './Service';

/**
 * Servicio de timbrado y utilidades de CFDI. Alineado a TecnoFact\Sdk\CfdiService.
 */
export class CfdiService extends Service {
  private readonly xmlBuilder: CfdiXmlBuilder;

  constructor(config: Config, httpClient: IHttpClient) {
    super(config, httpClient);
    this.xmlBuilder = new CfdiXmlBuilder();
  }

  public async timbrar(cfdi: Cfdi4Request): Promise<ResultadoTimbrado> {
    let xml: string;
    try {
      xml = this.xmlBuilder.build(cfdi);
    } catch (e) {
      throw new TimbradoException(`Failed to build CFDI XML: ${(e as Error).message}`);
    }
    return this.timbrarXml(xml);
  }

  public async timbrarXml(xml: string): Promise<ResultadoTimbrado> {
    try {
      const response = await this.httpClient.post(
        `${this.getBaseUrl()}/api/v1/stamp-cfdi`,
        this.getHeaders(),
        { xml }
      );
      return ResultadoTimbrado.fromResponse(response);
    } catch (e) {
      throw new TimbradoException(`Failed to timbrar XML: ${(e as Error).message}`);
    }
  }

  public async timbrarPago(request: PagoRequest): Promise<ResultadoTimbrado> {
    let xml: string;
    try {
      xml = this.xmlBuilder.buildPago(request);
    } catch (e) {
      throw new TimbradoException(`Failed to build Pago XML: ${(e as Error).message}`);
    }
    return this.timbrarXml(xml);
  }

  public async validar(xml: string): Promise<EstatusCfdi> {
    try {
      const response = await this.httpClient.postMultipart(
        `${this.getBaseUrl()}/api/v1/validation-cfdi`,
        this.getHeaders(),
        { xml }
      );
      return EstatusCfdi.fromResponse(response);
    } catch (e) {
      throw new TecnoFactException(`Failed to validate CFDI: ${(e as Error).message}`);
    }
  }

  public async getXml(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(`${this.getBaseUrl()}/cfdi/${uuid}/xml`, this.getHeaders());
    } catch (e) {
      throw new TimbradoException(`Failed to get XML: ${(e as Error).message}`);
    }
  }

  public async getPdf(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(`${this.getBaseUrl()}/cfdi/${uuid}/pdf`, this.getHeaders());
    } catch (e) {
      throw new TimbradoException(`Failed to get PDF: ${(e as Error).message}`);
    }
  }

  public async getHtml(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(`${this.getBaseUrl()}/cfdi/${uuid}/html`, this.getHeaders());
    } catch (e) {
      throw new TimbradoException(`Failed to get HTML: ${(e as Error).message}`);
    }
  }

  public async getStatus(uuid: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.get(
        `${this.getBaseUrl()}/cfdi/${uuid}/status`,
        this.getHeaders()
      );
    } catch (e) {
      throw new TimbradoException(`Failed to get CFDI status: ${(e as Error).message}`);
    }
  }

  public async sendByEmail(uuid: string, email: string): Promise<Record<string, unknown>> {
    try {
      return await this.httpClient.post(
        `${this.getBaseUrl()}/cfdi/${uuid}/send-email`,
        this.getHeaders(),
        { email }
      );
    } catch (e) {
      throw new TimbradoException(`Failed to send CFDI by email: ${(e as Error).message}`);
    }
  }
}
