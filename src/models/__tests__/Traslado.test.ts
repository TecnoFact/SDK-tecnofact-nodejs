import { Traslado } from '../Traslado';

describe('Traslado', () => {
  const isValidData = {
    base: 10000.0,
    impuesto: '002',
    tipoFactor: 'Tasa',
    tasaOCuota: 0.16,
    importe: 1600.0,
  };

  describe('constructor', () => {
    it('should create traslado with valid data', () => {
      const traslado = new Traslado(isValidData);

      expect(traslado).toBeDefined();
    });

    it('should create traslado without tasaOCuota (Exento case)', () => {
      const traslado = new Traslado({
        base: 10000.0,
        impuesto: '002',
        tipoFactor: 'Exento',
        importe: 0.0,
      });

      expect(traslado.getTasaOCuota()).toBeNull();
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys', () => {
      const traslado = new Traslado(isValidData);
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

  describe('getters (PHP parity)', () => {
    it('should return base', () => {
      const traslado = new Traslado(isValidData);
      expect(traslado.getBase()).toBe(10000.0);
    });

    it('should return impuesto', () => {
      const traslado = new Traslado(isValidData);
      expect(traslado.getImpuesto()).toBe('002');
    });

    it('should return tipoFactor', () => {
      const traslado = new Traslado(isValidData);
      expect(traslado.getTipoFactor()).toBe('Tasa');
    });

    it('should return tasaOCuota when provided', () => {
      const traslado = new Traslado(isValidData);
      expect(traslado.getTasaOCuota()).toBe(0.16);
    });

    it('should return null tasaOCuota when omitted (Exento)', () => {
      const traslado = new Traslado({
        base: 10000.0,
        impuesto: '002',
        tipoFactor: 'Exento',
        importe: 0.0,
      });
      expect(traslado.getTasaOCuota()).toBeNull();
    });

    it('should return importe', () => {
      const traslado = new Traslado(isValidData);
      expect(traslado.getImporte()).toBe(1600.0);
    });
  });
});
