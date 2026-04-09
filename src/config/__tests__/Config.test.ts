import { Config } from '../Config';
import { Environment } from '../../enums';

describe('Config', () => {
  const validConfig = {
    apiKey: 'test-api-key',
    apiSecret: 'test-api-secret',
  };

  describe('constructor', () => {
    it('should create config with required parameters', () => {
      const config = new Config(validConfig);
      
      expect(config.getApiKey()).toBe('test-api-key');
      expect(config.getApiSecret()).toBe('test-api-secret');
    });

    it('should use default environment as SANDBOX', () => {
      const config = new Config(validConfig);
      
      expect(config.getEnvironment()).toBe(Environment.SANDBOX);
    });

    it('should use default timeout of 30000ms', () => {
      const config = new Config(validConfig);
      
      expect(config.getTimeout()).toBe(30000);
    });

    it('should use default retries of 3', () => {
      const config = new Config(validConfig);
      
      expect(config.getRetries()).toBe(3);
    });

    it('should accept custom environment', () => {
      const config = new Config({
        ...validConfig,
        environment: Environment.PRODUCTION,
      });
      
      expect(config.getEnvironment()).toBe(Environment.PRODUCTION);
    });

    it('should accept custom timeout', () => {
      const config = new Config({
        ...validConfig,
        timeout: 60000,
      });
      
      expect(config.getTimeout()).toBe(60000);
    });

    it('should accept custom retries', () => {
      const config = new Config({
        ...validConfig,
        retries: 5,
      });
      
      expect(config.getRetries()).toBe(5);
    });

    it('should throw error if apiKey is missing', () => {
      expect(() => {
        new Config({
          apiKey: '',
          apiSecret: 'secret',
        });
      }).toThrow('apiKey is required');
    });

    it('should throw error if apiSecret is missing', () => {
      expect(() => {
        new Config({
          apiKey: 'key',
          apiSecret: '',
        });
      }).toThrow('apiSecret is required');
    });

    it('should throw error if timeout is zero or negative', () => {
      expect(() => {
        new Config({
          ...validConfig,
          timeout: 0,
        });
      }).toThrow('timeout must be greater than 0');

      expect(() => {
        new Config({
          ...validConfig,
          timeout: -1,
        });
      }).toThrow('timeout must be greater than 0');
    });

    it('should throw error if retries is negative', () => {
      expect(() => {
        new Config({
          ...validConfig,
          retries: -1,
        });
      }).toThrow('retries must be non-negative');
    });
  });

  describe('getBaseUrl', () => {
    it('should return sandbox URL for SANDBOX environment', () => {
      const config = new Config({
        ...validConfig,
        environment: Environment.SANDBOX,
      });
      
      expect(config.getBaseUrl()).toBe('https://sandbox.tecnofact.com/api');
    });

    it('should return production URL for PRODUCTION environment', () => {
      const config = new Config({
        ...validConfig,
        environment: Environment.PRODUCTION,
      });
      
      expect(config.getBaseUrl()).toBe('https://api.tecnofact.com/api');
    });
  });

  describe('toObject', () => {
    it('should return object representation of config', () => {
      const config = new Config({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        environment: Environment.PRODUCTION,
        timeout: 45000,
        retries: 5,
      });
      
      const obj = config.toObject();
      
      expect(obj).toEqual({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        environment: Environment.PRODUCTION,
        baseUrl: 'https://api.tecnofact.com/api',
        timeout: 45000,
        retries: 5,
      });
    });
  });
});
