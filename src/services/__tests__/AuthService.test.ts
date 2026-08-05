import { AuthenticationException } from '../../exceptions';
import { AuthService } from '../AuthService';
import { makeConfig, makeMockHttpClient } from './_fixtures';

describe('AuthService', () => {
  const baseUrl = 'https://panelcfdi.tecnofact.mx';

  it('login: POST a /api/login, setea access_token y devuelve la respuesta', async () => {
    const httpClient = makeMockHttpClient();
    const config = makeConfig();
    const service = new AuthService(config, httpClient);

    const response = { access_token: 'jwt-abc', token_type: 'bearer' };
    httpClient.post.mockResolvedValueOnce(response as never);

    const result = await service.login('user@tecnofact.com', 'secret');

    expect(httpClient.post).toHaveBeenCalledWith(
      `${baseUrl}/api/login`,
      { Accept: 'application/json', 'Content-Type': 'application/json' },
      { email: 'user@tecnofact.com', password: 'secret' }
    );
    expect(config.getToken()).toBe('jwt-abc');
    expect(result).toEqual(response);
  });

  it('login: NO setea token si access_token no es string', async () => {
    const httpClient = makeMockHttpClient();
    const config = makeConfig();
    const service = new AuthService(config, httpClient);

    httpClient.post.mockResolvedValueOnce({ access_token: 12345 } as never);

    await service.login('user@tecnofact.com', 'secret');

    expect(config.getToken()).toBeNull();
  });

  it('login: NO setea token si access_token absent', async () => {
    const httpClient = makeMockHttpClient();
    const config = makeConfig();
    const service = new AuthService(config, httpClient);

    httpClient.post.mockResolvedValueOnce({ error: 'bad' } as never);

    await service.login('user@tecnofact.com', 'secret');

    expect(config.getToken()).toBeNull();
  });

  it('login: incluye Authorization Bearer si ya hay token', async () => {
    const httpClient = makeMockHttpClient();
    const config = makeConfig('prev-token');
    const service = new AuthService(config, httpClient);

    httpClient.post.mockResolvedValueOnce({ access_token: 'new-token' } as never);

    await service.login('user@tecnofact.com', 'secret');

    expect(httpClient.post).toHaveBeenCalledWith(
      `${baseUrl}/api/login`,
      expect.objectContaining({ Authorization: 'Bearer prev-token' }),
      expect.anything()
    );
    expect(config.getToken()).toBe('new-token');
  });

  it('login: envuelve errores en AuthenticationException', async () => {
    const httpClient = makeMockHttpClient();
    const config = makeConfig();
    const service = new AuthService(config, httpClient);

    httpClient.post.mockRejectedValue(new Error('boom') as never);

    await expect(service.login('a@b.com', 'p')).rejects.toMatchObject({
      name: 'AuthenticationException',
      message: 'Failed to authenticate: boom',
    });
    await expect(service.login('a@b.com', 'p')).rejects.toBeInstanceOf(AuthenticationException);
  });

  it('refreshToken: POST a /auth/refresh con refresh_token y setea access_token', async () => {
    const httpClient = makeMockHttpClient();
    const config = makeConfig();
    const service = new AuthService(config, httpClient);

    httpClient.post.mockResolvedValueOnce({ access_token: 'refreshed-jwt' } as never);

    const result = await service.refreshToken('rt-123');

    expect(httpClient.post).toHaveBeenCalledWith(`${baseUrl}/auth/refresh`, expect.anything(), {
      refresh_token: 'rt-123',
    });
    expect(config.getToken()).toBe('refreshed-jwt');
    expect(result).toEqual({ access_token: 'refreshed-jwt' });
  });

  it('refreshToken: envuelve errores en AuthenticationException', async () => {
    const httpClient = makeMockHttpClient();
    const service = new AuthService(makeConfig(), httpClient);

    httpClient.post.mockRejectedValueOnce(new Error('expired') as never);

    await expect(service.refreshToken('rt')).rejects.toMatchObject({
      name: 'AuthenticationException',
      message: 'Failed to refresh token: expired',
    });
  });

  it('logout: POST a /auth/logout, limpia token y devuelve true', async () => {
    const httpClient = makeMockHttpClient();
    const config = makeConfig('jwt-to-clear');
    const service = new AuthService(config, httpClient);

    httpClient.post.mockResolvedValueOnce({} as never);

    const result = await service.logout();

    expect(httpClient.post).toHaveBeenCalledWith(
      `${baseUrl}/auth/logout`,
      expect.objectContaining({ Authorization: 'Bearer jwt-to-clear' }),
      {}
    );
    expect(config.getToken()).toBeNull();
    expect(result).toBe(true);
  });

  it('logout: envuelve errores en AuthenticationException', async () => {
    const httpClient = makeMockHttpClient();
    const service = new AuthService(makeConfig(), httpClient);

    httpClient.post.mockRejectedValueOnce(new Error('net down') as never);

    await expect(service.logout()).rejects.toMatchObject({
      name: 'AuthenticationException',
      message: 'Failed to logout: net down',
    });
  });
});
