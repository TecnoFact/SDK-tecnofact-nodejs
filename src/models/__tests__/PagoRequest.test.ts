import { PagoRequest } from '../PagoRequest';
import { Emisor } from '../Emisor';
import { Receptor } from '../Receptor';
import { Pago } from '../Pago';
import { DoctoRelacionado } from '../DoctoRelacionado';

describe('PagoRequest', () => {
  const fecha = new Date('2024-01-15T12:00:00.000Z');
  const emisor = new Emisor({
    rfc: 'XAXX010101000',
    nombre: 'EMPRESA EMISORA SA DE CV',
    regimenFiscal: '601',
    cp: '06300',
  });
  const receptor = new Receptor({
    rfc: 'XAXX010101000',
    nombre: 'RECEPTOR SA DE CV',
    usoCfdi: 'P01',
    domicilioFiscalReceptor: '06300',
    regimenFiscalReceptor: '616',
  });
  const docto = new DoctoRelacionado({
    idDocumento: 'b11c22d3-1234-5678-9abc-def012345678',
    monedaDR: 'MXN',
    equivalenciaDR: '1',
    numParcialidad: 1,
    impSaldoAnt: '1000.00',
    impPagado: '500.00',
    impSaldoInsoluto: '500.00',
    objetoImpDR: '02',
  });
  const pago = new Pago({
    fechaPago: fecha,
    formaDePagoP: '01',
    monedaP: 'MXN',
    monto: '500.00',
    doctosRelacionados: [docto],
  });
  const validData = {
    emisor,
    receptor,
    pagos: [pago],
    fecha,
    lugarExpedicion: '06300',
  };

  describe('constructor', () => {
    it('should create pago request with valid data and default exportacion', () => {
      const request = new PagoRequest(validData);

      expect(request.getEmisor()).toBe(emisor);
      expect(request.getReceptor()).toBe(receptor);
      expect(request.getPagos()).toEqual([pago]);
      expect(request.getLugarExpedicion()).toBe('06300');
      expect(request.getExportacion()).toBe('01');
      expect(request.getSerie()).toBeNull();
      expect(request.getFolio()).toBeNull();
    });

    it('should accept optional serie, folio and custom exportacion', () => {
      const request = new PagoRequest({
        ...validData,
        serie: 'A',
        folio: '10',
        exportacion: '02',
      });

      expect(request.getSerie()).toBe('A');
      expect(request.getFolio()).toBe('10');
      expect(request.getExportacion()).toBe('02');
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys and nested models', () => {
      const request = new PagoRequest(validData);
      const obj = request.toObject();

      expect(obj).toEqual({
        emisor: emisor.toObject(),
        receptor: receptor.toObject(),
        pagos: [pago.toObject()],
        fecha: fecha.toISOString(),
        lugar_expedicion: '06300',
        exportacion: '01',
      });
      expect(obj).not.toHaveProperty('serie');
      expect(obj).not.toHaveProperty('folio');
    });

    it('should include optional serie and folio when defined', () => {
      const request = new PagoRequest({ ...validData, serie: 'A', folio: '10' });
      const obj = request.toObject();

      expect(obj.serie).toBe('A');
      expect(obj.folio).toBe('10');
    });
  });

  describe('getters', () => {
    it('should return correct emisor', () => {
      const request = new PagoRequest(validData);
      expect(request.getEmisor()).toBe(emisor);
    });

    it('should return correct receptor', () => {
      const request = new PagoRequest(validData);
      expect(request.getReceptor()).toBe(receptor);
    });

    it('should return correct pagos', () => {
      const request = new PagoRequest(validData);
      expect(request.getPagos()).toEqual([pago]);
    });

    it('should return correct fecha', () => {
      const request = new PagoRequest(validData);
      expect(request.getFecha()).toBe(fecha);
    });

    it('should return correct lugar expedicion', () => {
      const request = new PagoRequest(validData);
      expect(request.getLugarExpedicion()).toBe('06300');
    });

    it('should return correct exportacion', () => {
      const request = new PagoRequest(validData);
      expect(request.getExportacion()).toBe('01');
    });
  });
});
