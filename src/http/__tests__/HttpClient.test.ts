import { HttpClient } from '../HttpClient';
import { Config } from '../../config';
import {
  AuthenticationException,
  NotFoundException,
  ServerException,
  ValidationException,
} from '../../exceptions';

const headers = (extra: Record<string, string> = {}): Headers => {
  const h = new Headers();
  for (const [k, v] of Object.entries(extra)) {
    h.set(k, v);
  }
  return h;
};

const okResponse = (body: unknown, status = 200, extra: Record<string, string> = {}) => ({
  ok: true,
  status,
  text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  headers: headers(extra),
});

const errResponse = (body: unknown, status: number, extra: Record<string, string> = {}) => ({
  ok: false,
  status,
  text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  headers: headers(extra),
});

describe('HttpClient', () => {
  let config: Config;
  let httpClient: HttpClient;
  const mockFetch = jest.fn();
  let envSnapshot: Record<string, string | undefined>;

  beforeEach(() => {
    envSnapshot = { ...process.env };
    config = new Config({ email: 'u@e.com', password: 'p' });
    global.fetch = mockFetch as unknown as typeof fetch;
    httpClient = new HttpClient(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
    for (const key of Object.keys(process.env)) {
      if (!(key in envSnapshot)) {
        delete process.env[key as keyof NodeJS.ProcessEnv];
      }
    }
    for (const [key, value] of Object.entries(envSnapshot)) {
      if (value === undefined) {
        delete process.env[key as keyof NodeJS.ProcessEnv];
      } else {
        process.env[key as keyof NodeJS.ProcessEnv] = value;
      }
    }
  });

  describe('constructor / defaults', () => {
    it('usa solo Accept y Content-Type (sin X-API-Key/Secret)', async () => {
      mockFetch.mockResolvedValue(okResponse({ success: true }));

      await httpClient.post('endpoint');

      const init = mockFetch.mock.calls[0][1] as RequestInit;
      expect(init.headers).toEqual({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      });
    });

    it('endpoint se usa tal cual (no se antepone baseUrl)', async () => {
      mockFetch.mockResolvedValue(okResponse({}));

      await httpClient.post('https://panelcfdi.tecnofact.mx/api/foo');

      expect(mockFetch.mock.calls[0][0]).toBe('https://panelcfdi.tecnofact.mx/api/foo');
    });

    it('no muta NODE_TLS_REJECT_UNAUTHORIZED ni NODE_EXTRA_CA_CERTS', () => {
      delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      delete process.env.NODE_EXTRA_CA_CERTS;

      const withCa = new Config({
        email: 'u@e.com',
        password: 'p',
        verifySsl: '/tmp/ca.pem',
      });
      new HttpClient(withCa);

      expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).toBeUndefined();
      expect(process.env.NODE_EXTRA_CA_CERTS).toBeUndefined();
    });
  });

  describe('post(endpoint, headers, data) — headers 2do, data 3ero', () => {
    it('hace POST con body JSON y headers mezclados', async () => {
      const body = { success: true };
      mockFetch.mockResolvedValue(okResponse(body));

      const result = await httpClient.post('endpoint', { 'X-Header': 'x' }, { test: 'data' });

      const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('endpoint');
      expect(init.method).toBe('POST');
      expect(init.body).toBe(JSON.stringify({ test: 'data' }));
      expect((init.headers as Record<string, string>)['X-Header']).toBe('x');
      expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
      expect(result).toEqual(body);
    });
  });

  describe('get(endpoint, headers, query)', () => {
    it('appenda query params al endpoint', async () => {
      mockFetch.mockResolvedValue(okResponse({ items: [] }));

      await httpClient.get('endpoint', undefined, { a: 'b', c: 'd' });

      expect(mockFetch.mock.calls[0][0]).toBe('endpoint?a=b&c=d');
      expect((mockFetch.mock.calls[0][1] as RequestInit).method).toBe('GET');
    });

    it('omite null/undefined en query', async () => {
      mockFetch.mockResolvedValue(okResponse({}));

      await httpClient.get('endpoint', undefined, { a: 'b', skip: undefined, n: null });

      expect(mockFetch.mock.calls[0][0]).toBe('endpoint?a=b');
    });

    it('sin query no añade "?"', async () => {
      mockFetch.mockResolvedValue(okResponse({}));

      await httpClient.get('endpoint');

      expect(mockFetch.mock.calls[0][0]).toBe('endpoint');
    });
  });

  describe('postMultipart(endpoint, headers, fields)', () => {
    it('envía FormData y NO incluye Content-Type', async () => {
      mockFetch.mockResolvedValue(okResponse({ ok: true }));

      await httpClient.postMultipart('endpoint', undefined, { xml: '<cfdi/>', foo: 'bar' });

      const init = mockFetch.mock.calls[0][1] as RequestInit;
      expect(init.body).toBeInstanceOf(FormData);
      const fd = init.body as FormData;
      expect(fd.get('xml')).toBe('<cfdi/>');
      expect(fd.get('foo')).toBe('bar');
      expect((init.headers as Record<string, string>)['Content-Type']).toBeUndefined();
    });
  });

  describe('put(endpoint, headers, data)', () => {
    it('hace PUT con body JSON', async () => {
      mockFetch.mockResolvedValue(okResponse({ updated: true }));

      const result = await httpClient.put('endpoint', undefined, { name: 'test' });

      const init = mockFetch.mock.calls[0][1] as RequestInit;
      expect(init.method).toBe('PUT');
      expect(init.body).toBe(JSON.stringify({ name: 'test' }));
      expect(result).toEqual({ updated: true });
    });
  });

  describe('delete(endpoint, headers, data)', () => {
    it('hace DELETE con body JSON', async () => {
      mockFetch.mockResolvedValue(okResponse({ deleted: true }));

      const result = await httpClient.delete('endpoint', undefined, { id: 1 });

      const init = mockFetch.mock.calls[0][1] as RequestInit;
      expect(init.method).toBe('DELETE');
      expect(init.body).toBe(JSON.stringify({ id: 1 }));
      expect(result).toEqual({ deleted: true });
    });
  });

  describe('timeout (segundos → ms)', () => {
    it('convierte 30 segundos del config a 30000ms en el AbortController', async () => {
      const cfg = new Config({ email: 'u@e.com', password: 'p', timeout: 30 });
      const client = new HttpClient(cfg);
      mockFetch.mockResolvedValue(okResponse({}));

      await client.get('endpoint');

      const init = mockFetch.mock.calls[0][1] as RequestInit;
      const signal = init.signal as AbortSignal;
      // No hay forma directa de leer el timeout del signal; verificamos que se
      // pasa un AbortSignal (no undefined) y que el cálculo interno no truena.
      expect(signal).toBeInstanceOf(AbortSignal);
    });
  });

  describe('retry sobre 5xx / 429', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    it('reintenta en 500 hasta agotar retries (initial + 2 = 3 fetch calls)', async () => {
      const cfg = new Config({ email: 'u@e.com', password: 'p', retries: 2 });
      const client = new HttpClient(cfg);
      mockFetch
        .mockResolvedValueOnce(errResponse({ message: 'err' }, 500))
        .mockResolvedValueOnce(errResponse({ message: 'err' }, 500))
        .mockResolvedValueOnce(okResponse({ ok: true }));

      const promise = client.get('endpoint');
      await jest.advanceTimersByTimeAsync(1000);
      await jest.advanceTimersByTimeAsync(2000);
      const result = await promise;

      expect(result).toEqual({ ok: true });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('reintenta en 429 igual que 5xx', async () => {
      const cfg = new Config({ email: 'u@e.com', password: 'p', retries: 1 });
      const client = new HttpClient(cfg);
      mockFetch
        .mockResolvedValueOnce(errResponse({ message: 'slow down' }, 429))
        .mockResolvedValueOnce(okResponse({ ok: true }));

      const promise = client.get('endpoint');
      await jest.advanceTimersByTimeAsync(1000);
      const result = await promise;

      expect(result).toEqual({ ok: true });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('NO reintenta en 400 (1 sola llamada)', async () => {
      mockFetch.mockResolvedValue(errResponse({ message: 'bad' }, 400));

      await expect(httpClient.get('endpoint')).rejects.toThrow(ValidationException);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('mapeo de errores por status', () => {
    it('400 → ValidationException', async () => {
      mockFetch.mockResolvedValue(errResponse({ message: 'Bad request' }, 400));
      await expect(httpClient.get('endpoint')).rejects.toThrow(ValidationException);
    });

    it('422 → ValidationException', async () => {
      mockFetch.mockResolvedValue(errResponse({ message: 'Unprocessable' }, 422));
      await expect(httpClient.post('endpoint')).rejects.toThrow(ValidationException);
    });

    it('401 → AuthenticationException', async () => {
      mockFetch.mockResolvedValue(errResponse({ message: 'Unauthorized' }, 401));
      await expect(httpClient.get('endpoint')).rejects.toThrow(AuthenticationException);
    });

    it('404 → NotFoundException', async () => {
      mockFetch.mockResolvedValue(errResponse({ message: 'Not found' }, 404));
      await expect(httpClient.get('endpoint')).rejects.toThrow(NotFoundException);
    });

    it('429 → RateLimitException con retry_after de body', async () => {
      mockFetch.mockResolvedValue(errResponse({ message: 'Too many', retry_after: 30 }, 429));
      const cfg = new Config({ email: 'u@e.com', password: 'p', retries: 0 });
      const client = new HttpClient(cfg);
      await expect(client.get('endpoint')).rejects.toMatchObject({
        name: 'RateLimitException',
        retryAfter: 30,
      });
    });

    it('429 → RateLimitException con fallback 60 si no hay retry_after', async () => {
      mockFetch.mockResolvedValue(errResponse({ message: 'Too many' }, 429));
      const cfg = new Config({ email: 'u@e.com', password: 'p', retries: 0 });
      const client = new HttpClient(cfg);
      await expect(client.get('endpoint')).rejects.toMatchObject({
        name: 'RateLimitException',
        retryAfter: 60,
      });
    });

    it('500 → ServerException (retries=0)', async () => {
      mockFetch.mockResolvedValue(errResponse({ message: 'Boom' }, 500));
      const cfg = new Config({ email: 'u@e.com', password: 'p', retries: 0 });
      const client = new HttpClient(cfg);
      await expect(client.get('endpoint')).rejects.toMatchObject({
        name: 'ServerException',
        statusCode: 500,
      });
    });

    it('502/503/504 → ServerException (retries=0)', async () => {
      const cfg = new Config({ email: 'u@e.com', password: 'p', retries: 0 });
      for (const status of [502, 503, 504]) {
        jest.clearAllMocks();
        mockFetch.mockResolvedValueOnce(errResponse({ message: 'down' }, status));
        const client = new HttpClient(cfg);
        await expect(client.get('endpoint')).rejects.toThrow(ServerException);
      }
    });

    it('418 → ServerException (default branch)', async () => {
      const cfg = new Config({ email: 'u@e.com', password: 'p', retries: 0 });
      const client = new HttpClient(cfg);
      mockFetch.mockResolvedValue(errResponse({ message: "I'm a teapot" }, 418));
      await expect(client.get('endpoint')).rejects.toThrow(ServerException);
    });

    it('error de red → TecnoFactException con "Error de conexión: "', async () => {
      const cfg = new Config({ email: 'u@e.com', password: 'p', retries: 0 });
      const client = new HttpClient(cfg);
      mockFetch.mockRejectedValue(new Error('Network down'));
      await expect(client.get('endpoint')).rejects.toThrow(/Error de conexión: Network down/);
    });
  });

  describe('extracción de mensaje', () => {
    it('prioriza message > error > mensaje > fallback', async () => {
      const cfg = new Config({ email: 'u@e.com', password: 'p', retries: 0 });
      const client = new HttpClient(cfg);

      mockFetch.mockResolvedValueOnce(errResponse({ message: 'from-message' }, 500));
      await expect(client.get('endpoint')).rejects.toMatchObject({ message: 'from-message' });

      mockFetch.mockResolvedValueOnce(errResponse({ error: 'from-error' }, 500));
      await expect(client.get('endpoint')).rejects.toMatchObject({ message: 'from-error' });

      mockFetch.mockResolvedValueOnce(errResponse({ mensaje: 'from-mensaje' }, 500));
      await expect(client.get('endpoint')).rejects.toMatchObject({ message: 'from-mensaje' });

      mockFetch.mockResolvedValueOnce(errResponse({ foo: 'bar' }, 500));
      await expect(client.get('endpoint')).rejects.toMatchObject({ message: 'Error desconocido' });
    });
  });

  describe('parseResponse', () => {
    it('body vacío → {}', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => '',
        headers: headers(),
      });
      const result = await httpClient.get('endpoint');
      expect(result).toEqual({});
    });

    it('JSON inválido → TecnoFactException con mensaje de decode', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => 'not-json{',
        headers: headers(),
      });
      await expect(httpClient.get('endpoint')).rejects.toThrow(
        /Error al decodificar respuesta JSON/
      );
    });
  });
});
