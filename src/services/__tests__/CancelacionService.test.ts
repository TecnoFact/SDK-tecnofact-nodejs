import { CancelacionException } from '../../exceptions';
import { CancelacionService } from '../CancelacionService';
import { makeConfig, makeMockHttpClient } from './_fixtures';

describe('CancelacionService', () => {
  const baseUrl = 'https://panelcfdi.tecnofact.mx';

  it('cancelar: POST a /api/v1/cancelled-cfdi con {rfc,uuid,motivo} y devuelve AcuseCancelacion', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CancelacionService(makeConfig('jwt'), httpClient);

    httpClient.post.mockResolvedValueOnce({
      success: true,
      data: { uuid: 'U1', status_sat: '201', xml: '<acuse/>', validado: true },
    } as never);

    const result = await service.cancelar('XAXX010101000', 'U1', '02');

    expect(httpClient.post).toHaveBeenCalledWith(
      `${baseUrl}/api/v1/cancelled-cfdi`,
      expect.anything(),
      { rfc: 'XAXX010101000', uuid: 'U1', motivo: '02' }
    );
    expect(result.isSuccess()).toBe(true);
    expect(result.getUuid()).toBe('U1');
    expect(result.getStatusSat()).toBe('201');
    expect(result.isValidado()).toBe(true);
  });

  it('cancelar: error envuelve en CancelacionException', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CancelacionService(makeConfig(), httpClient);
    httpClient.post.mockRejectedValue(new Error('sat down') as never);

    await expect(service.cancelar('R', 'U', '01')).rejects.toMatchObject({
      name: 'CancelacionException',
      message: 'Failed to cancel CFDI: sat down',
    });
    await expect(service.cancelar('R', 'U', '01')).rejects.toBeInstanceOf(CancelacionException);
  });

  it.each([
    ['getStatus', 'status', 'Failed to get cancellation status'],
    ['obtenerAcuse', 'acuse', 'Failed to get acuse'],
  ] as const)('%s: GET a /cancelacion/:uuid/%s', async (method, suffix, prefix) => {
    const httpClient = makeMockHttpClient();
    const service = new CancelacionService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({ ok: true } as never);

    await (service as unknown as Record<string, (u: string) => Promise<unknown>>)[method]('UUID-7');

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}/cancelacion/UUID-7/${suffix}`,
      expect.anything()
    );
    if (prefix) {
      httpClient.get.mockRejectedValueOnce(new Error('boom') as never);
      await expect(
        (service as unknown as Record<string, (u: string) => Promise<unknown>>)[method]('U')
      ).rejects.toMatchObject({ name: 'CancelacionException', message: `${prefix}: boom` });
    }
  });

  it('getPending: GET a /cancelacion/pendientes', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CancelacionService(makeConfig('jwt'), httpClient);
    httpClient.get.mockResolvedValueOnce({ pendientes: [] } as never);

    await service.getPending();

    expect(httpClient.get).toHaveBeenCalledWith(
      `${baseUrl}/cancelacion/pendientes`,
      expect.anything()
    );
  });

  it('getPending: error envuelve en CancelacionException', async () => {
    const httpClient = makeMockHttpClient();
    const service = new CancelacionService(makeConfig(), httpClient);
    httpClient.get.mockRejectedValueOnce(new Error('boom') as never);

    await expect(service.getPending()).rejects.toMatchObject({
      name: 'CancelacionException',
      message: 'Failed to get pending cancellations: boom',
    });
  });
});
