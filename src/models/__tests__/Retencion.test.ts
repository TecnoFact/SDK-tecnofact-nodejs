import { Retencion } from '../Retencion';

describe('Retencion', () => {
  const validData = {
    base: 10000.0,
    impuesto: '001',
    tipoFactor: 'Tasa',
    tasaOCuota: 0.1,
    importe: 1000.0,
  };

  describe('constructor', () => {
    it('should create retencion with valid data', () => {
      const retencion = new Retencion(validData);

      expect(retencion).toBeDefined();
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys', () => {
      const retencion = new Retencion(validData);
      const obj = retencion.toObject();

      expect(obj).toEqual({
        base: 10000.0,
        impuesto: '001',
        tipo_factor: 'Tasa',
        tasa_o_cuota: 0.1,
        importe: 1000.0,
      });
    });
  });

  describe('getters (PHP parity)', () => {
    it('should return base', () => {
      const retencion = new Retencion(validData);
      expect(retencion.getBase()).toBe(10000.0);
    });

    it('should return impuesto', () => {
      const retencion = new Retencion(validData);
      expect(retencion.getImpuesto()).toBe('001');
    });

    it('should return tipoFactor', () => {
      const retencion = new Retencion(validData);
      expect(retencion.getTipoFactor()).toBe('Tasa');
    });

    it('should return tasaOCuota', () => {
      const retencion = new Retencion(validData);
      expect(retencion.getTasaOCuota()).toBe(0.1);
    });

    it('should return importe', () => {
      const retencion = new Retencion(validData);
      expect(retencion.getImporte()).toBe(1000.0);
    });
  });
});
