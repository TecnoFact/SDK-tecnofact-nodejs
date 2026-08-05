import { CuentaPredial } from '../CuentaPredial';

describe('CuentaPredial', () => {
  const validData = {
    numero: '1234567890',
  };

  describe('constructor', () => {
    it('should create cuenta predial with valid data', () => {
      const cuenta = new CuentaPredial(validData);

      expect(cuenta.getNumero()).toBe('1234567890');
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys', () => {
      const cuenta = new CuentaPredial(validData);
      const obj = cuenta.toObject();

      expect(obj).toEqual({
        numero: '1234567890',
      });
    });
  });

  describe('getters', () => {
    it('should return correct numero', () => {
      const cuenta = new CuentaPredial(validData);
      expect(cuenta.getNumero()).toBe('1234567890');
    });
  });
});
