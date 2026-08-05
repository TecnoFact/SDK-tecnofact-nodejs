import { Environment, EnvironmentHelper } from '../Environment';

describe('Environment', () => {
  describe('enum values', () => {
    it('PRODUCTION vale "production"', () => {
      expect(Environment.PRODUCTION).toBe('production');
    });
  });

  describe('EnvironmentHelper', () => {
    describe('isProduction', () => {
      it('devuelve true para PRODUCTION', () => {
        expect(EnvironmentHelper.isProduction(Environment.PRODUCTION)).toBe(true);
      });
    });

    describe('getLabel', () => {
      it('devuelve "Producción" para PRODUCTION', () => {
        expect(EnvironmentHelper.getLabel(Environment.PRODUCTION)).toBe('Producción');
      });
    });

    describe('getBaseUrl', () => {
      it('devuelve la URL de producción sin sufijo /api', () => {
        expect(EnvironmentHelper.getBaseUrl(Environment.PRODUCTION)).toBe(
          'https://panelcfdi.tecnofact.mx'
        );
      });
    });

    describe('fromValue', () => {
      it('resuelve "production" a Environment.PRODUCTION', () => {
        expect(EnvironmentHelper.fromValue('production')).toBe(Environment.PRODUCTION);
      });

      it('es insensible a mayúsculas/espacios', () => {
        expect(EnvironmentHelper.fromValue(' Production ')).toBe(Environment.PRODUCTION);
      });

      it('lanza para "sandbox" (entorno no disponible)', () => {
        expect(() => EnvironmentHelper.fromValue('sandbox')).toThrow(/invalid|unknown/i);
      });

      it('lanza para valores desconocidos', () => {
        expect(() => EnvironmentHelper.fromValue('foo')).toThrow(/invalid|unknown/i);
      });
    });
  });

  describe('Environment enum (paridad PHP)', () => {
    it('no expone SANDBOX', () => {
      expect((Environment as unknown as Record<string, unknown>).SANDBOX).toBeUndefined();
    });
  });
});
