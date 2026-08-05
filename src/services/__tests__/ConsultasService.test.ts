import { NotFoundException } from '../../exceptions';
import { ConsultasService } from '../ConsultasService';
import { makeConfig, makeMockHttpClient } from './_fixtures';

describe('ConsultasService', () => {
  const baseUrl = 'https://panelcfdi.tecnofact.mx';

  it('buscarPorUuid: GET a /consultas/uuid/:uuid', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({ data: { uuid: 'U1' } } as never);

    await service.buscarPorUuid('U1');

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/consultas/uuid/U1`, expect.anything());
  });

  it('buscarPorUuid: error envuelve en NotFoundException "CFDI not found: "', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValue(new Error('404') as never);

    await expect(service.buscarPorUuid('U1')).rejects.toMatchObject({
      name: 'NotFoundException',
      message: 'CFDI not found: 404',
    });
    await expect(service.buscarPorUuid('U1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('buscarPorRfc: omite query params null', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.buscarPorRfc('XAXX010101000');

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}/consultas/rfc/XAXX010101000`,
      expect.anything(),
      {}
    );
  });

  it('buscarPorRfc: incluye solo query params provistos (fecha_inicio)', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.buscarPorRfc('RFC', '2024-01-01');

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/consultas/rfc/RFC`, expect.anything(), {
      fecha_inicio: '2024-01-01',
    });
  });

  it('buscarPorRfc: incluye solo query params provistos (fecha_fin)', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.buscarPorRfc('RFC', null, '2024-12-31');

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/consultas/rfc/RFC`, expect.anything(), {
      fecha_fin: '2024-12-31',
    });
  });

  it('buscarPorRfc: incluye ambos query params', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.buscarPorRfc('RFC', '2024-01-01', '2024-12-31');

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/consultas/rfc/RFC`, expect.anything(), {
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-31',
    });
  });

  it('buscarPorRfc: error envuelve en NotFoundException', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValueOnce(new Error('boom') as never);

    await expect(service.buscarPorRfc('RFC')).rejects.toMatchObject({
      name: 'NotFoundException',
      message: 'Failed to search by RFC: boom',
    });
  });

  it('buscarPorSerie: GET a /consultas/serie/:serie/folio/:folio', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.buscarPorSerie('A', '100');

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}/consultas/serie/A/folio/100`,
      expect.anything()
    );
  });

  it('verificarSat: GET a /consultas/sat/:uuid', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({ estado: 'Vigente' } as never);

    await service.verificarSat('U1');

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/consultas/sat/U1`, expect.anything());
  });

  it('listar: usa defaults page=1 perPage=20 y claves snake_case {page, per_page}', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.listar();

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/consultas`, expect.anything(), {
      page: 1,
      per_page: 20,
    });
  });

  it('listar: acepta page y perPage personalizados', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({} as never);

    await service.listar(3, 50);

    expect(httpClient.get).toHaveBeenCalledWith(`${baseUrl}/consultas`, expect.anything(), {
      page: 3,
      per_page: 50,
    });
  });

  it('listar: error envuelve en NotFoundException', async () => {
    const httpClient = makeMockHttpClient();
    const service = new ConsultasService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValueOnce(new Error('boom') as never);

    await expect(service.listar()).rejects.toMatchObject({
      name: 'NotFoundException',
      message: 'Failed to list CFDIs: boom',
    });
  });
});
