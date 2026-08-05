import { IHttpClient } from '../../contracts';
import { Service } from '../Service';
import { makeConfig, makeMockHttpClient } from './_fixtures';

class TestService extends Service {}

describe('Service (abstract base)', () => {
  let httpClient: jest.Mocked<IHttpClient>;

  beforeEach(() => {
    httpClient = makeMockHttpClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getHeaders no incluye Authorization cuando no hay token', () => {
    const config = makeConfig(null);
    const service = new TestService(config, httpClient);

    const headers = (
      service as unknown as { getHeaders: () => Record<string, string> }
    ).getHeaders();

    expect(headers['Authorization']).toBeUndefined();
    expect(headers['Accept']).toBe('application/json');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('getHeaders incluye Authorization Bearer cuando hay token', () => {
    const config = makeConfig('jwt-token-123');
    const service = new TestService(config, httpClient);

    const headers = (
      service as unknown as { getHeaders: () => Record<string, string> }
    ).getHeaders();

    expect(headers['Authorization']).toBe('Bearer jwt-token-123');
    expect(headers['Accept']).toBe('application/json');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('getBaseUrl devuelve la base URL de Config', () => {
    const config = makeConfig();
    const service = new TestService(config, httpClient);

    const baseUrl = (service as unknown as { getBaseUrl: () => string }).getBaseUrl();

    expect(baseUrl).toBe('https://panelcfdi.tecnofact.mx');
  });

  it('almacena config y httpClient inyectados', () => {
    const config = makeConfig('t1');
    const service = new TestService(config, httpClient);

    expect((service as unknown as { config: unknown }).config).toBe(config);
    expect((service as unknown as { httpClient: unknown }).httpClient).toBe(httpClient);
  });
});
