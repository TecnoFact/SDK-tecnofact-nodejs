import { ValidationException } from '../../exceptions';
import { ValidacionesService } from '../ValidacionesService';
import { makeConfig, makeMockHttpClient } from './_fixtures';

describe('ValidacionesService', () => {
  const baseUrl = 'https://panelcfdi.tecnofact.mx';

  it('validarXml: POST a /validaciones/xml con { xml: <base64> }', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ValidacionesService(makeConfig('jwt'), httpClient);
    const originalXml = '<cfdi:Comprobante/>';
    const expected = Buffer.from(originalXml, 'utf8').toString('base64');
    httpClient.post.mockResolvedValueOnce({ valido: true } as never);

    await service.validarXml(originalXml);

    expect(httpClient.post).toHaveBeenCalledWith(`${baseUrl}/validaciones/xml`, expect.anything(), {
      xml: expected,
    });
  });

  it('validarXml: el body es exactamente Buffer.from(xml,utf8).toString(base64) (round-trip correcto)', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ValidacionesService(makeConfig('jwt'), httpClient);
    const originalXml = '<?xml version="1.0"?><root><child>áéíóú</child></root>';
    httpClient.post.mockResolvedValueOnce({} as never);

    await service.validarXml(originalXml);

    const body = httpClient.post.mock.calls[0][2] as Record<string, unknown>;
    expect(body['xml']).toBe(Buffer.from(originalXml, 'utf8').toString('base64'));
    expect(Buffer.from(body['xml'] as string, 'base64').toString('utf8')).toBe(originalXml);
  });

  it('validarXml: error envuelve en ValidationException "Failed to validate XML: "', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ValidacionesService(makeConfig(), httpClient);
    httpClient.post.mockRejectedValue(new Error('bad') as never);

    await expect(service.validarXml('<xml/>')).rejects.toMatchObject({
      name: 'ValidationException',
      message: 'Failed to validate XML: bad',
    });
    await expect(service.validarXml('<xml/>')).rejects.toBeInstanceOf(ValidationException);
  });

  it('validarRfc: GET a /validaciones/rfc/:rfc', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ValidacionesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({ valido: true } as never);

    await service.validarRfc('XAXX010101000');

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}/validaciones/rfc/XAXX010101000`,
      expect.anything()
    );
  });

  it('validarRfc: error envuelve en ValidationException "Failed to validate RFC: "', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ValidacionesService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValueOnce(new Error('bad') as never);

    await expect(service.validarRfc('R')).rejects.toMatchObject({
      name: 'ValidationException',
      message: 'Failed to validate RFC: bad',
    });
  });

  it('validarNoCertificado: GET a /validaciones/certificado/:noCertificado', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ValidacionesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.validarNoCertificado('30001000000300023708');

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}/validaciones/certificado/30001000000300023708`,
      expect.anything()
    );
  });

  it('validarNoCertificado: error envuelve en ValidationException "Failed to validate certificate: "', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ValidacionesService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValueOnce(new Error('x') as never);

    await expect(service.validarNoCertificado('C')).rejects.toMatchObject({
      name: 'ValidationException',
      message: 'Failed to validate certificate: x',
    });
  });

  it.each([
    ['getCatalogos', '/validaciones/catalogos'],
    ['getUnidadesMedida', '/validaciones/catalogos/unidades'],
    ['getProductosServicios', '/validaciones/catalogos/productos'],
    ['getImpuestos', '/validaciones/catalogos/impuestos'],
  ] as const)('%s: GET al endpoint %s', async (method, path) => {
    const httpClient = makeMockHttpClient();
    const service = new ValidacionesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await (service as unknown as Record<string, () => Promise<unknown>>)[method]();

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}${path}`, expect.anything());
  });

  it.each([
    ['getCatalogos', 'Failed to get catalogos'],
    ['getUnidadesMedida', 'Failed to get unidades de medida'],
    ['getProductosServicios', 'Failed to get productos y servicios'],
    ['getImpuestos', 'Failed to get impuestos'],
  ] as const)('%s: error envuelve en ValidationException', async (method, prefix) => {
    const httpClient = makeMockHttpClient();
    const service = new ValidacionesService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValueOnce(new Error('boom') as never);

    await expect(
      (service as unknown as Record<string, () => Promise<unknown>>)[method]()
    ).rejects.toMatchObject({ name: 'ValidationException', message: `${prefix}: boom` });
  });
});
