import { HttpClient } from '../HttpClient';
import { Config } from '../../config';
import { Environment } from '../../enums';
import {
  AuthenticationException,
  ValidationException,
  NotFoundException,
  RateLimitException,
  ServerException,
  TecnoFactException,
} from '../../exceptions';

describe('HttpClient', () => {
  let config: Config;
  let httpClient: HttpClient;
  const mockFetch = jest.fn();

  beforeEach(() => {
    config = new Config({
      apiKey: 'test-key',
      apiSecret: 'test-secret',
      environment: Environment.SANDBOX,
    });
    global.fetch = mockFetch;
    httpClient = new HttpClient(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should use correct base URL and default headers in requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await httpClient.post('endpoint', { test: 'data' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://sandbox.tecnofact.com/api/endpoint',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-API-Key': 'test-key',
            'X-API-Secret': 'test-secret',
          },
          body: JSON.stringify({ test: 'data' }),
        })
      );
    });
  });

  describe('post', () => {
    it('should make POST request and return data', async () => {
      const responseData = { success: true, id: '123' };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      const result = await httpClient.post('endpoint', { test: 'data' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://sandbox.tecnofact.com/api/endpoint',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ test: 'data' }),
        })
      );
      expect(result).toEqual(responseData);
    });

    it('should handle custom headers', async () => {
      const responseData = { success: true };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      await httpClient.post('endpoint', {}, { 'Custom-Header': 'value' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://sandbox.tecnofact.com/api/endpoint',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Custom-Header': 'value',
          }),
        })
      );
    });
  });

  describe('get', () => {
    it('should make GET request and return data', async () => {
      const responseData = { items: [] };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      const result = await httpClient.get('endpoint', { page: 1 });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://sandbox.tecnofact.com/api/endpoint?page=1',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('put', () => {
    it('should make PUT request and return data', async () => {
      const responseData = { updated: true };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      const result = await httpClient.put('endpoint', { name: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://sandbox.tecnofact.com/api/endpoint',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'test' }),
        })
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('delete', () => {
    it('should make DELETE request and return data', async () => {
      const responseData = { deleted: true };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      const result = await httpClient.delete('endpoint');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://sandbox.tecnofact.com/api/endpoint',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('error handling', () => {
    it('should throw AuthenticationException on 401', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        AuthenticationException
      );
    });

    it('should throw ValidationException on 400', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' }),
      });

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        ValidationException
      );
    });

    it('should throw NotFoundException on 404', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
      });

      await expect(httpClient.get('endpoint')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw RateLimitException on 429', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ message: 'Too many requests' }),
      });

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        RateLimitException
      );
    });

    it('should throw ServerException on 500', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      });

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        ServerException
      );
    });

    it('should throw TecnoFactException on other status codes', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 418,
        json: async () => ({ message: "I'm a teapot" }),
      });

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        TecnoFactException
      );
    });

    it('should throw TecnoFactException on network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        TecnoFactException
      );
    });

    it('should throw TecnoFactException on unknown errors', async () => {
      mockFetch.mockRejectedValue('unknown');

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        'Unknown error occurred'
      );
    });
  });
});
