import axios from 'axios';
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

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  let config: Config;
  let httpClient: HttpClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    config = new Config({
      apiKey: 'test-key',
      apiSecret: 'test-secret',
      environment: Environment.SANDBOX,
    });

    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    httpClient = new HttpClient(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://sandbox.tecnofact.com/api',
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-Key': 'test-key',
          'X-API-Secret': 'test-secret',
        },
      });
    });
  });

  describe('post', () => {
    it('should make POST request and return data', async () => {
      const responseData = { success: true, id: '123' };
      mockAxiosInstance.post.mockResolvedValue({ data: responseData });

      const result = await httpClient.post('endpoint', { test: 'data' });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/endpoint',
        { test: 'data' },
        { headers: undefined }
      );
      expect(result).toEqual(responseData);
    });

    it('should handle custom headers', async () => {
      const responseData = { success: true };
      mockAxiosInstance.post.mockResolvedValue({ data: responseData });

      await httpClient.post('endpoint', {}, { 'Custom-Header': 'value' });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/endpoint',
        {},
        { headers: { 'Custom-Header': 'value' } }
      );
    });
  });

  describe('get', () => {
    it('should make GET request and return data', async () => {
      const responseData = { items: [] };
      mockAxiosInstance.get.mockResolvedValue({ data: responseData });

      const result = await httpClient.get('endpoint', { page: 1 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/endpoint',
        { params: { page: 1 }, headers: undefined }
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('put', () => {
    it('should make PUT request and return data', async () => {
      const responseData = { updated: true };
      mockAxiosInstance.put.mockResolvedValue({ data: responseData });

      const result = await httpClient.put('endpoint', { name: 'test' });

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/endpoint',
        { name: 'test' },
        { headers: undefined }
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('delete', () => {
    it('should make DELETE request and return data', async () => {
      const responseData = { deleted: true };
      mockAxiosInstance.delete.mockResolvedValue({ data: responseData });

      const result = await httpClient.delete('endpoint');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/endpoint',
        { headers: undefined }
      );
      expect(result).toEqual(responseData);
    });
  });

  describe('error handling', () => {
    it('should throw AuthenticationException on 401', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
        isAxiosError: true,
      };
      mockAxiosInstance.post.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        AuthenticationException
      );
    });

    it('should throw ValidationException on 400', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Bad request' },
        },
        isAxiosError: true,
      };
      mockAxiosInstance.post.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        ValidationException
      );
    });

    it('should throw NotFoundException on 404', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
        isAxiosError: true,
      };
      mockAxiosInstance.get.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(httpClient.get('endpoint')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw RateLimitException on 429', async () => {
      const error = {
        response: {
          status: 429,
          data: { message: 'Too many requests' },
        },
        isAxiosError: true,
      };
      mockAxiosInstance.post.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        RateLimitException
      );
    });

    it('should throw ServerException on 500', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
        isAxiosError: true,
      };
      mockAxiosInstance.post.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        ServerException
      );
    });

    it('should throw TecnoFactException on other status codes', async () => {
      const error = {
        response: {
          status: 418,
          data: { message: "I'm a teapot" },
        },
        isAxiosError: true,
      };
      mockAxiosInstance.post.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        TecnoFactException
      );
    });

    it('should throw TecnoFactException on non-axios errors', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValue(error);
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        TecnoFactException
      );
    });

    it('should throw TecnoFactException on unknown errors', async () => {
      mockAxiosInstance.post.mockRejectedValue('unknown');
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(httpClient.post('endpoint', {})).rejects.toThrow(
        'Unknown error occurred'
      );
    });
  });
});
