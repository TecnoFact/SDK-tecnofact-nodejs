import { Traslado } from '../Traslado';

describe('Traslado', () => {
  const validData = {
    base: 10000.0,
    impuesto: '002',
    tipoFactor: 'Tasa',
    tasaOCuota: 0.16,
    importe: 1600.0,
  };

  describe('constructor', () => {
    it('should create traslado with valid data', () => {
      const traslado = new Traslado(validData);
      
      expect(traslado).toBeDefined();
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys', () => {
      const traslado = new Traslado(validData);
      const obj = traslado.toObject();
      
      expect(obj).toEqual({
        base: 10000.0,
        impuesto: '002',
        tipo_factor: 'Tasa',
        tasa_o_cuota: 0.16,
        importe: 1600.0,
      });
    });
  });
});
