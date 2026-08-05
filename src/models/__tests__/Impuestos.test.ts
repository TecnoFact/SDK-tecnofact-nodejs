import { Impuestos } from '../Impuestos';
import { RetencionGlobal } from '../RetencionGlobal';
import { TrasladoGlobal } from '../TrasladoGlobal';

describe('Impuestos', () => {
  describe('constructor', () => {
    it('should create impuestos with traslados only', () => {
      const traslados = [
        new TrasladoGlobal({
          impuesto: '002',
          tipoFactor: 'Tasa',
          tasaOCuota: 0.16,
          importe: 1600.0,
        }),
      ];

      const impuestos = new Impuestos({
        totalImpuestosTrasladados: 1600.0,
        traslados,
      });

      expect(impuestos).toBeDefined();
    });

    it('should create impuestos with retenciones only', () => {
      const retenciones = [
        new RetencionGlobal({
          impuesto: '001',
          importe: 1000.0,
        }),
      ];

      const impuestos = new Impuestos({
        totalImpuestosRetenidos: 1000.0,
        retenciones,
      });

      expect(impuestos).toBeDefined();
    });

    it('should create impuestos with both traslados and retenciones', () => {
      const traslados = [
        new TrasladoGlobal({
          impuesto: '002',
          tipoFactor: 'Tasa',
          tasaOCuota: 0.16,
          importe: 1600.0,
        }),
      ];

      const retenciones = [
        new RetencionGlobal({
          impuesto: '001',
          importe: 1000.0,
        }),
      ];

      const impuestos = new Impuestos({
        totalImpuestosTrasladados: 1600.0,
        totalImpuestosRetenidos: 1000.0,
        traslados,
        retenciones,
      });

      expect(impuestos).toBeDefined();
    });
  });

  describe('toObject', () => {
    it('should return object with all fields', () => {
      const traslados = [
        new TrasladoGlobal({
          impuesto: '002',
          tipoFactor: 'Tasa',
          tasaOCuota: 0.16,
          importe: 1600.0,
        }),
      ];

      const retenciones = [
        new RetencionGlobal({
          impuesto: '001',
          importe: 1000.0,
        }),
      ];

      const impuestos = new Impuestos({
        totalImpuestosTrasladados: 1600.0,
        totalImpuestosRetenidos: 1000.0,
        traslados,
        retenciones,
      });

      const obj = impuestos.toObject();

      expect(obj.total_impuestos_trasladados).toBe(1600.0);
      expect(obj.total_impuestos_retenidos).toBe(1000.0);
      expect(obj.traslados).toHaveLength(1);
      expect(obj.retenciones).toHaveLength(1);
    });
  });

  describe('getters (PHP parity)', () => {
    it('should return total impuestos retenidos when provided', () => {
      const impuestos = new Impuestos({ totalImpuestosRetenidos: 1000.0 });
      expect(impuestos.getTotalImpuestosRetenidos()).toBe(1000.0);
    });

    it('should return null total impuestos retenidos when omitted', () => {
      const impuestos = new Impuestos({});
      expect(impuestos.getTotalImpuestosRetenidos()).toBeNull();
    });

    it('should return total impuestos trasladados when provided', () => {
      const impuestos = new Impuestos({ totalImpuestosTrasladados: 1600.0 });
      expect(impuestos.getTotalImpuestosTrasladados()).toBe(1600.0);
    });

    it('should return null total impuestos trasladados when omitted', () => {
      const impuestos = new Impuestos({});
      expect(impuestos.getTotalImpuestosTrasladados()).toBeNull();
    });

    it('should return traslados when provided', () => {
      const traslados = [new TrasladoGlobal({ impuesto: '002', tipoFactor: 'Tasa' })];
      const impuestos = new Impuestos({ traslados });
      expect(impuestos.getTraslados()).toHaveLength(1);
    });

    it('should return null traslados when omitted', () => {
      const impuestos = new Impuestos({});
      expect(impuestos.getTraslados()).toBeNull();
    });

    it('should return retenciones when provided', () => {
      const retenciones = [new RetencionGlobal({ impuesto: '001', importe: 1000.0 })];
      const impuestos = new Impuestos({ retenciones });
      expect(impuestos.getRetenciones()).toHaveLength(1);
    });

    it('should return null retenciones when omitted', () => {
      const impuestos = new Impuestos({});
      expect(impuestos.getRetenciones()).toBeNull();
    });
  });
});
