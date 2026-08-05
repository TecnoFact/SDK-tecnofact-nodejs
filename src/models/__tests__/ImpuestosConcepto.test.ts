import { ImpuestosConcepto } from '../ImpuestosConcepto';
import { Retencion } from '../Retencion';
import { Traslado } from '../Traslado';

describe('ImpuestosConcepto', () => {
  const traslados = [
    new Traslado({
      base: 10000.0,
      impuesto: '002',
      tipoFactor: 'Tasa',
      tasaOCuota: 0.16,
      importe: 1600.0,
    }),
  ];

  const retenciones = [
    new Retencion({
      base: 10000.0,
      impuesto: '001',
      tipoFactor: 'Tasa',
      tasaOCuota: 0.1,
      importe: 1000.0,
    }),
  ];

  describe('constructor', () => {
    it('should create impuestos conceptowith traslados', () => {
      const impuestos = new ImpuestosConcepto({ traslados });
      expect(impuestos).toBeDefined();
    });

    it('should create empty impuestos concept by default', () => {
      const impuestos = new ImpuestosConcepto({});
      expect(impuestos.getTraslados()).toHaveLength(0);
      expect(impuestos.getRetenciones()).toHaveLength(0);
    });
  });

  describe('toObject', () => {
    it('should serialize traslados and retenciones', () => {
      const impuestos = new ImpuestosConcepto({ traslados, retenciones });
      const obj = impuestos.toObject();

      expect(obj.traslados).toHaveLength(1);
      expect(obj.retenciones).toHaveLength(1);
    });

    it('should omit empty arrays', () => {
      const impuestos = new ImpuestosConcepto({});
      const obj = impuestos.toObject();
      expect(obj).toEqual({});
    });
  });

  describe('getters (PHP parity)', () => {
    it('should return traslados array', () => {
      const impuestos = new ImpuestosConcepto({ traslados });
      expect(impuestos.getTraslados()).toHaveLength(1);
      expect(impuestos.getTraslados()[0]).toBeInstanceOf(Traslado);
    });

    it('should return retenciones array', () => {
      const impuestos = new ImpuestosConcepto({ retenciones });
      expect(impuestos.getRetenciones()).toHaveLength(1);
      expect(impuestos.getRetenciones()[0]).toBeInstanceOf(Retencion);
    });

    it('should return empty arrays when not provided (PHP default [])', () => {
      const impuestos = new ImpuestosConcepto({});
      expect(Array.isArray(impuestos.getTraslados())).toBe(true);
      expect(Array.isArray(impuestos.getRetenciones())).toBe(true);
    });
  });
});
