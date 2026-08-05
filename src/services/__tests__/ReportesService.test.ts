import { ValidationException } from '../../exceptions';
import { ReportesService } from '../ReportesService';
import { makeConfig, makeMockHttpClient } from './_fixtures';

describe('ReportesService', () => {
  const baseUrl = 'https://panelcfdi.tecnofact.mx';

  it('getResumen: GET a /reportes/resumen con fecha_inicio y fecha_fin', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({ total: 10 } as never);

    await service.getResumen('2024-01-01', '2024-12-31');

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/reportes/resumen`, expect.anything(), {
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-31',
    });
  });

  it('getResumen: error envuelve en ValidationException "Failed to get resumen: "', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValue(new Error('boom') as never);

    await expect(service.getResumen('a', 'b')).rejects.toMatchObject({
      name: 'ValidationException',
      message: 'Failed to get resumen: boom',
    });
    await expect(service.getResumen('a', 'b')).rejects.toBeInstanceOf(ValidationException);
  });

  it('getVentas: omite query params null', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.getVentas();

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}/reportes/ventas`,
      expect.anything(),
      {}
    );
  });

  it('getVentas: incluye solo los params provistos', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.getVentas('2024-01-01', null);

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/reportes/ventas`, expect.anything(), {
      fecha_inicio: '2024-01-01',
    });
  });

  it('getCancelaciones: GET a /reportes/cancelaciones con ambos params', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.getCancelaciones('2024-01-01', '2024-12-31');

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}/reportes/cancelaciones`,
      expect.anything(),
      { fecha_inicio: '2024-01-01', fecha_fin: '2024-12-31' }
    );
  });

  it.each([
    ['getXml', '/reportes/xml/%s', 'Failed to get XML report'],
    ['getPdf', '/reportes/pdf/%s', 'Failed to get PDF report'],
  ] as const)('%s: GET al endpoint con uuid', async (method, path, prefix) => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await (service as unknown as Record<string, (u: string) => Promise<unknown>>)[method]('UUID-9');

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}${path.replace('%s', 'UUID-9')}`,
      expect.anything()
    );
    httpClient.get.mockRejectedValueOnce(new Error('boom') as never);
    await expect(
      (service as unknown as Record<string, (u: string) => Promise<unknown>>)[method]('U')
    ).rejects.toMatchObject({ name: 'ValidationException', message: `${prefix}: boom` });
  });

  it('exportarCsv: GET a /reportes/exportar con formato="csv"', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({ url: 'csv-link' } as never);

    await service.exportarCsv('2024-01-01', '2024-12-31');

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/reportes/exportar`, expect.anything(), {
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-31',
      formato: 'csv',
    });
  });

  it('exportarExcel: GET a /reportes/exportar con formato="xlsx"', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({ url: 'xlsx-link' } as never);

    await service.exportarExcel('2024-01-01', '2024-12-31');

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/reportes/exportar`, expect.anything(), {
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-31',
      formato: 'xlsx',
    });
  });

  it('exportarCsv: error envuelve en ValidationException "Failed to export CSV: "', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValueOnce(new Error('boom') as never);

    await expect(service.exportarCsv('a', 'b')).rejects.toMatchObject({
      name: 'ValidationException',
      message: 'Failed to export CSV: boom',
    });
  });

  it('exportarExcel: error envuelve en ValidationException "Failed to export Excel: "', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ReportesService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValueOnce(new Error('boom') as never);

    await expect(service.exportarExcel('a', 'b')).rejects.toMatchObject({
      name: 'ValidationException',
      message: 'Failed to export Excel: boom',
    });
  });
});
