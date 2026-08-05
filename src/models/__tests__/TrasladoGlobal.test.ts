import { TrasladoGlobal } from '../TrasladoGlobal';

describe('TrasladoGlobal', () => {
  describe('constructor', () => {
    it('should create traslado global with full fields', () => {
      const traslado = new TrasladoGlobal({
        base: 10000.0,
        impuesto: '002',
        tipoFactor: 'Tasa',
        tasaOCuota: 0.16,
        importe: 1600.0,
      });

      expect(traslado).toBeDefined();
    });

    it('should create traslado global Exento without tasaOCuota and importe (PHP parity)', () => {
      const traslado = new TrasladoGlobal({
        base: 10000.0,
        impuesto: '002',
        tipoFactor: 'Exento',
      });

      expect(traslado.getTasaOCuota()).toBeNull();
      expect(traslado.getImporte()).toBeNull();
    });
  });

  describe('toObject', () => {
    it('should serialize impuesto, tipoFactor, tasa_o_cuota, importe', () => {
      const traslado = new TrasladoGlobal({
        impuesto: '002',
        tipoFactor: 'Tasa',
        tasaOCuota: 0.16,
        importe: 1600.0,
      });
      const obj = traslado.toObject();

      expect(obj).toEqual({
        impuesto: '002',
        tipo_factor: 'Tasa',
        tasa_o_cuota: 0.16,
        importe: 1600.0,
      });
    });

    it('should include base when provided', () => {
      const traslado = new TrasladoGlobal({
        base: 10000.0,
        impuesto: '002',
        tipoFactor: 'Tasa',
        tasaOCuota: 0.16,
        importe: 1600.0,
      });
      const obj = traslado.toObject();

      expect(obj.base).toBe(10000.0);
    });

    it('should omit base when not provided (additive)', () => {
      const traslado = new TrasladoGlobal({
        impuesto: '002',
        tipoFactor: 'Tasa',
        tasaOCuota: 0.16,
        importe: 1600.0,
      });
      const obj = traslado.toObject();

      expect(obj).not.toHaveProperty('base');
    });
  });

  describe('getters (PHP parity)', () => {
    it('should return base when provided', () => {
      const traslado = new TrasladoGlobal({ base: 100, impuesto: '002', tipoFactor: 'Tasa' });
      expect(traslado.getBase()).toBe(100);
    });

    it('should return null base when omitted', () => {
      const traslado = new TrasladoGlobal({ impuesto: '002', tipoFactor: 'Tasa' });
      expect(traslado.getBase()).toBeNull();
    });

    it('should return impuesto', () => {
      const traslado = new TrasladoGlobal({ impuesto: '002', tipoFactor: 'Tasa' });
      expect(traslado.getImpuesto()).toBe('002');
    });

    it('should return tipoFactor', () => {
      const traslado = new TrasladoGlobal({ impuesto: '002', tipoFactor: 'Tasa' });
      expect(traslado.getTipoFactor()).toBe('Tasa');
    });

    it('should return tasaOCuota when provided', () => {
      const traslado = new TrasladoGlobal({
        impuesto: '002',
        tipoFactor: 'Tasa',
        tasaOCuota: 0.16,
      });
      expect(traslado.getTasaOCuota()).toBe(0.16);
    });

    it('should return null tasaOCuota when omitted (Exento)', () => {
      const traslado = new TrasladoGlobal({ impuesto: '002', tipoFactor: 'Exento' });
      expect(traslado.getTasaOCuota()).toBeNull();
    });

    it('should return importe when provided', () => {
      const traslado = new TrasladoGlobal({
        impuesto: '002',
        tipoFactor: 'Tasa',
        importe: 1600.0,
      });
      expect(traslado.getImporte()).toBe(1600.0);
    });

    it('should return null importe when omitted (Exento)', () => {
      const traslado = new TrasladoGlobal({ impuesto: '002', tipoFactor: 'Exento' });
      expect(traslado.getImporte()).toBeNull();
    });
  });
});
