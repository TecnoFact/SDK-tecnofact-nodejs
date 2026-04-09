import { TipoComprobante, TipoComprobanteHelper } from '../TipoComprobante';

describe('TipoComprobante', () => {
  describe('enum values', () => {
    it('should have INGRESO value', () => {
      expect(TipoComprobante.INGRESO).toBe('I');
    });

    it('should have EGRESO value', () => {
      expect(TipoComprobante.EGRESO).toBe('E');
    });

    it('should have TRASLADO value', () => {
      expect(TipoComprobante.TRASLADO).toBe('T');
    });

    it('should have NOMINA value', () => {
      expect(TipoComprobante.NOMINA).toBe('N');
    });

    it('should have PAGO value', () => {
      expect(TipoComprobante.PAGO).toBe('P');
    });
  });

  describe('TipoComprobanteHelper', () => {
    describe('getLabel', () => {
      it('should return correct label for INGRESO', () => {
        expect(TipoComprobanteHelper.getLabel(TipoComprobante.INGRESO)).toBe('Ingreso');
      });

      it('should return correct label for EGRESO', () => {
        expect(TipoComprobanteHelper.getLabel(TipoComprobante.EGRESO)).toBe('Egreso');
      });

      it('should return correct label for TRASLADO', () => {
        expect(TipoComprobanteHelper.getLabel(TipoComprobante.TRASLADO)).toBe('Traslado');
      });

      it('should return correct label for NOMINA', () => {
        expect(TipoComprobanteHelper.getLabel(TipoComprobante.NOMINA)).toBe('Nómina');
      });

      it('should return correct label for PAGO', () => {
        expect(TipoComprobanteHelper.getLabel(TipoComprobante.PAGO)).toBe('Pago');
      });
    });
  });
});
