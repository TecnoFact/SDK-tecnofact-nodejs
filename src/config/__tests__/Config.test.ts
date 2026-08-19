import { Config } from '../Config';
import { Environment } from '../../enums';

describe('Config', () => {
  const validBase = { email: 'user@tecnofact.com', password: 'secret' };

  describe('constructor', () => {
    it('happy path con defaults', () => {
      const config = new Config(validBase);

      expect(config.getEmail()).toBe('user@tecnofact.com');
      expect(config.getPassword()).toBe('secret');
      expect(config.getEnvironment()).toBe(Environment.PRODUCTION);
      expect(config.isProduction()).toBe(true);
      expect(config.getBaseUrl()).toBe('https://panelcfdi.tecnofact.mx');
      expect(config.getTimeout()).toBe(30);
      expect(config.getRetries()).toBe(3);
      expect(config.getVerifySsl()).toBe(true);
      expect(config.getToken()).toBeNull();
    });

    it('acepta entorno PRODUCTION explícito', () => {
      const config = new Config({ ...validBase, environment: Environment.PRODUCTION });
      expect(config.getEnvironment()).toBe(Environment.PRODUCTION);
    });

    it('acepta timeout personalizado (segundos)', () => {
      const config = new Config({ ...validBase, timeout: 60 });
      expect(config.getTimeout()).toBe(60);
    });

    it('acepta retries personalizado', () => {
      const config = new Config({ ...validBase, retries: 5 });
      expect(config.getRetries()).toBe(5);
    });

    it('rechaza verifySsl=false (no se deshabilita TLS a nivel de proceso)', () => {
      expect(() => new Config({ ...validBase, verifySsl: false })).toThrow(
        /verifySsl=false no está soportado/
      );
    });

    it('acepta verifySsl como path de CA bundle', () => {
      const config = new Config({ ...validBase, verifySsl: '/path/to/ca.pem' });
      expect(config.getVerifySsl()).toBe('/path/to/ca.pem');
    });

    it('lanza si el email está vacío', () => {
      expect(() => new Config({ email: '', password: 'secret' })).toThrow(
        /Email no puede estar vacío/
      );
    });

    it('lanza si el email es inválido', () => {
      expect(() => new Config({ email: 'not-an-email', password: 'secret' })).toThrow(
        /Email no tiene un formato válido/
      );
    });

    it('lanza si el password está vacío', () => {
      expect(() => new Config({ email: 'user@tecnofact.com', password: '' })).toThrow(
        /Password no puede estar vacío/
      );
    });

    it('lanza si timeout es 0', () => {
      expect(() => new Config({ ...validBase, timeout: 0 })).toThrow(
        /Timeout debe estar entre 1 y 300 segundos/
      );
    });

    it('lanza si timeout es 301', () => {
      expect(() => new Config({ ...validBase, timeout: 301 })).toThrow(
        /Timeout debe estar entre 1 y 300 segundos/
      );
    });

    it('lanza si retries es -1', () => {
      expect(() => new Config({ ...validBase, retries: -1 })).toThrow(
        /Retries debe estar entre 0 y 10/
      );
    });

    it('lanza si retries es 11', () => {
      expect(() => new Config({ ...validBase, retries: 11 })).toThrow(
        /Retries debe estar entre 0 y 10/
      );
    });

    it('lanza si verifySsl es un string vacío', () => {
      expect(() => new Config({ ...validBase, verifySsl: '' })).toThrow(
        /VerifySsl no puede ser un string vacío/
      );
    });
  });

  describe('token', () => {
    it('setToken/getToken roundtrip y clear con null', () => {
      const config = new Config(validBase);
      expect(config.getToken()).toBeNull();

      config.setToken('jwt-token');
      expect(config.getToken()).toBe('jwt-token');

      config.setToken(null);
      expect(config.getToken()).toBeNull();
    });
  });

  describe('toObject', () => {
    it('devuelve la forma esperada (sin token/email/password)', () => {
      const config = new Config({
        email: 'user@tecnofact.com',
        password: 'secret',
        timeout: 60,
        retries: 5,
        verifySsl: true,
      });

      expect(config.toObject()).toEqual({
        environment: Environment.PRODUCTION,
        baseUrl: 'https://panelcfdi.tecnofact.mx',
        timeout: 60,
        retries: 5,
        verifySsl: true,
      });
    });
  });

  describe('fromEnvironment', () => {
    let snapshot: Record<string, string | undefined>;

    beforeEach(() => {
      snapshot = { ...process.env };
      // Limpia las variables que usaremos en cada test.
      delete process.env.TECN_FACT_EMAIL;
      delete process.env.TECN_FACT_PASSWORD;
      delete process.env.TECN_FACT_ENVIRONMENT;
      delete process.env.TECN_FACT_TIMEOUT;
      delete process.env.TECN_FACT_RETRIES;
      delete process.env.TECN_FACT_VERIFY_SSL;
    });

    afterEach(() => {
      // Restaura el snapshot exacto del process.env.
      for (const key of Object.keys(process.env)) {
        if (!(key in snapshot)) {
          delete process.env[key as keyof NodeJS.ProcessEnv];
        }
      }
      for (const [key, value] of Object.entries(snapshot)) {
        if (value === undefined) {
          delete process.env[key as keyof NodeJS.ProcessEnv];
        } else {
          process.env[key as keyof NodeJS.ProcessEnv] = value;
        }
      }
    });

    it('construye con los valores requeridos y aplica defaults', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';

      const config = Config.fromEnvironment();

      expect(config.getEmail()).toBe('u@e.com');
      expect(config.getPassword()).toBe('p');
      expect(config.getEnvironment()).toBe(Environment.PRODUCTION);
      expect(config.getTimeout()).toBe(30);
      expect(config.getRetries()).toBe(3);
      expect(config.getVerifySsl()).toBe(true);
    });

    it('lanza si falta TECN_FACT_EMAIL', () => {
      process.env.TECN_FACT_PASSWORD = 'p';

      expect(() => Config.fromEnvironment()).toThrow(
        /Variable de entorno TECN_FACT_EMAIL es requerida/
      );
    });

    it('lanza si falta TECN_FACT_PASSWORD', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';

      expect(() => Config.fromEnvironment()).toThrow(
        /Variable de entorno TECN_FACT_PASSWORD es requerida/
      );
    });

    it('acepta entorno "production" explícito', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';
      process.env.TECN_FACT_ENVIRONMENT = 'production';

      expect(Config.fromEnvironment().getEnvironment()).toBe(Environment.PRODUCTION);
    });

    it('lanza si el entorno no es soportado', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';
      process.env.TECN_FACT_ENVIRONMENT = 'sandbox';

      expect(() => Config.fromEnvironment()).toThrow(/invalid|unknown/i);
    });

    it('acepta timeout personalizado', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';
      process.env.TECN_FACT_TIMEOUT = '60';

      expect(Config.fromEnvironment().getTimeout()).toBe(60);
    });

    it('acepta retries personalizado', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';
      process.env.TECN_FACT_RETRIES = '5';

      expect(Config.fromEnvironment().getRetries()).toBe(5);
    });

    it('mapea verifySsl "true" → true', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';
      process.env.TECN_FACT_VERIFY_SSL = 'true';

      expect(Config.fromEnvironment().getVerifySsl()).toBe(true);
    });

    it('mapea verifySsl "1" → true', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';
      process.env.TECN_FACT_VERIFY_SSL = '1';

      expect(Config.fromEnvironment().getVerifySsl()).toBe(true);
    });

    it('rechaza verifySsl "false"', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';
      process.env.TECN_FACT_VERIFY_SSL = 'false';

      expect(() => Config.fromEnvironment()).toThrow(/verifySsl=false no está soportado/);
    });

    it('rechaza verifySsl "0"', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';
      process.env.TECN_FACT_VERIFY_SSL = '0';

      expect(() => Config.fromEnvironment()).toThrow(/verifySsl=false no está soportado/);
    });

    it('mapea verifySsl con path → string (CA bundle)', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';
      process.env.TECN_FACT_VERIFY_SSL = '/etc/ssl/ca.pem';

      expect(Config.fromEnvironment().getVerifySsl()).toBe('/etc/ssl/ca.pem');
    });

    it('verifySsl ausente → true', () => {
      process.env.TECN_FACT_EMAIL = 'u@e.com';
      process.env.TECN_FACT_PASSWORD = 'p';

      expect(Config.fromEnvironment().getVerifySsl()).toBe(true);
    });
  });
});
