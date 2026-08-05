import { CfdiXmlBuilder } from '../../xml/CfdiXmlBuilder';
import { TecnoFactException, TimbradoException } from '../../exceptions';
import { CfdiService } from '../CfdiService';
import { makeCfdi, makeConfig, makeMockHttpClient, makePagoRequest } from './_fixtures';

describe('CfdiService', () => {
  const baseUrl = 'https://panelcfdi.tecnofact.mx';

  it('timbrar: construye XML y llama timbrarXml; body xml contiene <cfdi:Comprobante', async () => {
    const httpClient = makeMockHttpClient();
    const config = makeConfig('jwt');
    const service = new CfdiService(config, httpClient);

    httpClient.post.mockResolvedValueOnce({
      success: true,
      data: { xml_timbrado: '<xml/>', uuid: 'ABC-123' },
    } as never);

    const result = await service.timbrar(makeCfdi());

    expect(httpClient.post).toHaveBeenCalledTimes(1);
    expect(httpClient.post).toHaveBeenCalledWith(
      `${baseUrl}/api/v1/stamp-cfdi`,
      expect.anything(),
      expect.objectContaining({ xml: expect.stringContaining('<cfdi:Comprobante') })
    );
    expect(result.isSuccess()).toBe(true);
    expect(result.getUuid()).toBe('ABC-123');
    expect(result.getXmlTimbrado()).toBe('<xml/>');
  });

  it('timbrar: error al construir XML envuelve en TimbradoException (build-error path)', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig(), httpClient);

    const spy = jest.spyOn(CfdiXmlBuilder.prototype, 'build').mockImplementationOnce(() => {
      throw new Error('xml fail');
    });

    await expect(service.timbrar(makeCfdi())).rejects.toMatchObject({
      name: 'TimbradoException',
      message: 'Failed to build CFDI XML: xml fail',
    });
    expect(httpClient.post).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('timbrarXml: POST a /api/v1/stamp-cfdi con { xml }', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig('jwt'), httpClient);

    httpClient.post.mockResolvedValueOnce({
      success: true,
      data: { uuid: 'X', xml_timbrado: 'Y' },
    } as never);

    await service.timbrarXml('<xml/>');

    expect(httpClient.post).toHaveBeenCalledWith(
      `${baseUrl}/api/v1/stamp-cfdi`,
      expect.anything(),
      { xml: '<xml/>' }
    );
  });

  it('timbrarXml: error al timbrar envuelve en TimbradoException', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig(), httpClient);

    httpClient.post.mockRejectedValue(new Error('500 up') as never);

    await expect(service.timbrarXml('<xml/>')).rejects.toMatchObject({
      name: 'TimbradoException',
      message: 'Failed to timbrar XML: 500 up',
    });
    await expect(service.timbrarXml('<xml/>')).rejects.toBeInstanceOf(TimbradoException);
  });

  it('timbrarPago: construye el complemento de pago y envía xml a timbrar', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig('jwt'), httpClient);

    httpClient.post.mockResolvedValueOnce({
      success: true,
      data: { uuid: 'P-1', xml_timbrado: 'Z' },
    } as never);

    await service.timbrarPago(makePagoRequest());

    expect(httpClient.post).toHaveBeenCalledWith(
      `${baseUrl}/api/v1/stamp-cfdi`,
      expect.anything(),
      expect.objectContaining({
        xml: expect.stringContaining('TipoDeComprobante="P"'),
      })
    );
    expect((httpClient.post.mock.calls[0][2] as Record<string, unknown>)['xml']).toContain(
      'pago20'
    );
  });

  it('validar: usa postMultipart a /api/v1/validation-cfdi con { xml }', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig('jwt'), httpClient);

    httpClient.postMultipart.mockResolvedValueOnce({
      success: true,
      data: { estado: 'Vigente', codigo: 'S' },
    } as never);

    const result = await service.validar('<xml/>');

    expect(httpClient.postMultipart).toHaveBeenCalledWith(
      `${baseUrl}/api/v1/validation-cfdi`,
      expect.anything(),
      { xml: '<xml/>' }
    );
    expect(result.getEstado()).toBe('Vigente');
  });

  it('validar: error envuelve en TecnoFactException (no Timbrado)', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig(), httpClient);

    httpClient.postMultipart.mockRejectedValue(new Error('bad xml') as never);

    await expect(service.validar('<xml/>')).rejects.toMatchObject({
      name: 'TecnoFactException',
      message: 'Failed to validate CFDI: bad xml',
    });
    await expect(service.validar('<xml/>')).rejects.toBeInstanceOf(TecnoFactException);
  });

  it.each([
    ['getXml', '/cfdi/%s/xml'],
    ['getPdf', '/cfdi/%s/pdf'],
    ['getHtml', '/cfdi/%s/html'],
    ['getStatus', '/cfdi/%s/status'],
  ] as const)('%s: GET al endpoint correcto', async (method, path) => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({ ok: true } as never);

    await (service as unknown as Record<string, (u: string) => Promise<unknown>>)[method]('UUID-1');

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}${path.replace('%s', 'UUID-1')}`,
      expect.anything()
    );
  });

  it.each([
    ['getXml', 'Failed to get XML'],
    ['getPdf', 'Failed to get PDF'],
    ['getHtml', 'Failed to get HTML'],
    ['getStatus', 'Failed to get CFDI status'],
  ] as const)('%s: error envuelve en TimbradoException con prefijo', async (method, prefix) => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValueOnce(new Error('boom') as never);

    await expect(
      (service as unknown as Record<string, (u: string) => Promise<unknown>>)[method]('U')
    ).rejects.toMatchObject({ name: 'TimbradoException', message: `${prefix}: boom` });
  });

  it('sendByEmail: POST a /cfdi/:uuid/send-email con { email }', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig('jwt'), httpClient);
    httpClient.post.mockResolvedValueOnce({ sent: true } as never);

    await service.sendByEmail('UUID-9', 'cliente@dominio.com');

    expect(httpClient.post).toHaveBeenCalledWith(
      `${baseUrl}/cfdi/UUID-9/send-email`,
      expect.anything(),
      { email: 'cliente@dominio.com' }
    );
  });

  it('sendByEmail: error envuelve en TimbradoException', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig(), httpClient);
    httpClient.post.mockRejectedValueOnce(new Error('no smtp') as never);

    await expect(service.sendByEmail('U', 'e@e.com')).rejects.toMatchObject({
      name: 'TimbradoException',
      message: 'Failed to send CFDI by email: no smtp',
    });
  });

  it('timbrarPago: build-error envuelve en TimbradoException', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CfdiService(makeConfig(), httpClient);

    const spy = jest.spyOn(CfdiXmlBuilder.prototype, 'buildPago').mockImplementationOnce(() => {
      throw new Error('pago fail');
    });

    await expect(service.timbrarPago(makePagoRequest())).rejects.toMatchObject({
      name: 'TimbradoException',
      message: 'Failed to build Pago XML: pago fail',
    });
    expect(httpClient.post).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
