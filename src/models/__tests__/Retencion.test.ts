import { Retencion } from '../Retencion';

describe('Retencion', () => {
  const validData = {
    base: 10000.0,
    impuesto: '001',
    tipoFactor: 'Tasa',
    tasaOCuota: 0.10,
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
        tasa_o_cuota: 0.10,
        importe: 1000.0,
      });
    });
  });
});
