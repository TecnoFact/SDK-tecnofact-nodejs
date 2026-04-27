import { Impuestos } from '../Impuestos';
import { TrasladoGlobal } from '../TrasladoGlobal';
import { RetencionGlobal } from '../RetencionGlobal';

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
});
