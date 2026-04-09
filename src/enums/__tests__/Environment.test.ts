import { Environment, EnvironmentHelper } from '../Environment';

describe('Environment', () => {
  describe('enum values', () => {
    it('should have SANDBOX value', () => {
      expect(Environment.SANDBOX).toBe('sandbox');
    });

    it('should have PRODUCTION value', () => {
      expect(Environment.PRODUCTION).toBe('production');
    });
  });

  describe('EnvironmentHelper', () => {
    describe('isProduction', () => {
      it('should return true for PRODUCTION environment', () => {
        expect(EnvironmentHelper.isProduction(Environment.PRODUCTION)).toBe(true);
      });

      it('should return false for SANDBOX environment', () => {
        expect(EnvironmentHelper.isProduction(Environment.SANDBOX)).toBe(false);
      });
    });

    describe('isSandbox', () => {
      it('should return true for SANDBOX environment', () => {
        expect(EnvironmentHelper.isSandbox(Environment.SANDBOX)).toBe(true);
      });

      it('should return false for PRODUCTION environment', () => {
        expect(EnvironmentHelper.isSandbox(Environment.PRODUCTION)).toBe(false);
      });
    });

    describe('getLabel', () => {
      it('should return correct label for SANDBOX', () => {
        expect(EnvironmentHelper.getLabel(Environment.SANDBOX)).toBe('Sandbox');
      });

      it('should return correct label for PRODUCTION', () => {
        expect(EnvironmentHelper.getLabel(Environment.PRODUCTION)).toBe('Producción');
      });
    });

    describe('getBaseUrl', () => {
      it('should return sandbox URL for SANDBOX environment', () => {
        const url = EnvironmentHelper.getBaseUrl(Environment.SANDBOX);
        expect(url).toBe('https://sandbox.tecnofact.com/api');
      });

      it('should return production URL for PRODUCTION environment', () => {
        const url = EnvironmentHelper.getBaseUrl(Environment.PRODUCTION);
        expect(url).toBe('https://api.tecnofact.com/api');
      });
    });
  });
});
