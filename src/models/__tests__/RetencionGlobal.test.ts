import { RetencionGlobal } from '../RetencionGlobal';

describe('RetencionGlobal', () => {
  const validData = {
    impuesto: '001',
    importe: 1000.0,
  };

  describe('constructor', () => {
    it('should create retencion global with valid data', () => {
      const retencion = new RetencionGlobal(validData);
      expect(retencion).toBeDefined();
    });
  });

  describe('toObject', () => {
    it('should return object with impuesto and importe', () => {
      const retencion = new RetencionGlobal(validData);
      const obj = retencion.toObject();

      expect(obj).toEqual({
        impuesto: '001',
        importe: 1000.0,
      });
    });
  });

  describe('getters (PHP parity)', () => {
    it('should return impuesto', () => {
      const retencion = new RetencionGlobal(validData);
      expect(retencion.getImpuesto()).toBe('001');
    });

    it('should return importe', () => {
      const retencion = new RetencionGlobal(validData);
      expect(retencion.getImporte()).toBe(1000.0);
    });
  });
});
