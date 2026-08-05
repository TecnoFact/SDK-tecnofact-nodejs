import { Pago } from '../Pago';
import { DoctoRelacionado } from '../DoctoRelacionado';

describe('Pago', () => {
  const fecha = new Date('2024-01-15T12:00:00.000Z');
  const doctoData = {
    idDocumento: 'b11c22d3-1234-5678-9abc-def012345678',
    monedaDR: 'MXN',
    equivalenciaDR: '1',
    numParcialidad: 1,
    impSaldoAnt: '1000.00',
    impPagado: '500.00',
    impSaldoInsoluto: '500.00',
    objetoImpDR: '02',
  };
  const docto = new DoctoRelacionado(doctoData);
  const validData = {
    fechaPago: fecha,
    formaDePagoP: '01',
    monedaP: 'MXN',
    monto: '500.00',
    doctosRelacionados: [docto],
  };

  describe('constructor', () => {
    it('should create pago with valid data and default tipoCambioP', () => {
      const pago = new Pago(validData);

      expect(pago.getFormaDePagoP()).toBe('01');
      expect(pago.getTipoCambioP()).toBe('1');
      expect(pago.getMonto()).toBe('500.00');
      expect(pago.getDoctosRelacionados()).toEqual([docto]);
    });

    it('should accept custom tipoCambioP', () => {
      const pago = new Pago({ ...validData, tipoCambioP: '20.50' });

      expect(pago.getTipoCambioP()).toBe('20.50');
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys and nested doctos', () => {
      const pago = new Pago(validData);
      const obj = pago.toObject();

      expect(obj).toEqual({
        fecha_pago: fecha.toISOString(),
        forma_de_pago_p: '01',
        moneda_p: 'MXN',
        monto: '500.00',
        tipo_cambio_p: '1',
        doctos_relacionados: [docto.toObject()],
      });
    });

    it('should serialize fecha_pago as ISO string', () => {
      const pago = new Pago(validData);
      const obj = pago.toObject();

      expect(typeof obj.fecha_pago).toBe('string');
      expect(obj.fecha_pago).toBe(fecha.toISOString());
    });
  });

  describe('getters', () => {
    it('should return correct fecha pago', () => {
      const pago = new Pago(validData);
      expect(pago.getFechaPago()).toBe(fecha);
    });

    it('should return correct forma de pago p', () => {
      const pago = new Pago(validData);
      expect(pago.getFormaDePagoP()).toBe('01');
    });

    it('should return correct moneda p', () => {
      const pago = new Pago(validData);
      expect(pago.getMonedaP()).toBe('MXN');
    });

    it('should return correct monto', () => {
      const pago = new Pago(validData);
      expect(pago.getMonto()).toBe('500.00');
    });

    it('should return correct tipo cambio p', () => {
      const pago = new Pago(validData);
      expect(pago.getTipoCambioP()).toBe('1');
    });

    it('should return correct doctos relacionados', () => {
      const pago = new Pago(validData);
      expect(pago.getDoctosRelacionados()).toEqual([docto]);
    });
  });
});
