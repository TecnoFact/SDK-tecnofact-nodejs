import { Cfdi4Request } from '../Cfdi4Request';
import { CfdiRelacionados } from '../CfdiRelacionados';
import { Concepto } from '../Concepto';
import { Emisor } from '../Emisor';
import { Impuestos } from '../Impuestos';
import { InformacionGlobal } from '../InformacionGlobal';
import { Receptor } from '../Receptor';
import { TrasladoGlobal } from '../TrasladoGlobal';

describe('Cfdi4Request', () => {
  const emisor = new Emisor({
    rfc: 'XAXX010101000',
    nombre: 'EMPRESA EMISORA SA DE CV',
    regimenFiscal: '601',
    cp: '06300',
  });

  const receptor = new Receptor({
    rfc: 'XAXX010101001',
    nombre: 'CLIENTE RECEPTOR',
    usoCfdi: 'G03',
    domicilioFiscalReceptor: '06300',
    regimenFiscalReceptor: '612',
  });

  const concepto = new Concepto({
    claveProdServ: '01010101',
    cantidad: 1,
    claveUnidad: 'E48',
    descripcion: 'Servicio de desarrollo',
    valorUnitario: 10000.0,
    importe: 10000.0,
    objetoImp: '02',
  });

  const validData = {
    emisor,
    receptor,
    conceptos: [concepto],
    tipoComprobante: 'I',
    formaPago: '01',
    metodoPago: 'PUE',
    moneda: 'MXN',
    subtotal: 10000.0,
    total: 11600.0,
    lugarExpedicion: '06300',
  };

  describe('constructor', () => {
    it('should create CFDI request with required fields', () => {
      const cfdi = new Cfdi4Request(validData);

      expect(cfdi.getSubtotal()).toBe(10000.0);
      expect(cfdi.getTotal()).toBe(11600.0);
    });

    it('should create CFDI request with impuestos', () => {
      const impuestos = new Impuestos({
        totalImpuestosTrasladados: 1600.0,
        traslados: [
          new TrasladoGlobal({
            impuesto: '002',
            tipoFactor: 'Tasa',
            tasaOCuota: 0.16,
            importe: 1600.0,
          }),
        ],
      });

      const cfdi = new Cfdi4Request({
        ...validData,
        impuestos,
      });

      expect(cfdi).toBeDefined();
    });
  });

  describe('toObject', () => {
    it('should return object with required fields', () => {
      const cfdi = new Cfdi4Request(validData);
      const obj = cfdi.toObject();

      expect(obj.emisor).toBeDefined();
      expect(obj.receptor).toBeDefined();
      expect(obj.conceptos).toHaveLength(1);
      expect(obj.tipo_comprobante).toBe('I');
      expect(obj.forma_pago).toBe('01');
      expect(obj.metodo_pago).toBe('PUE');
      expect(obj.moneda).toBe('MXN');
      expect(obj.subtotal).toBe(10000.0);
      expect(obj.total).toBe(11600.0);
      expect(obj.lugar_expedicion).toBe('06300');
    });

    it('should include optional fields when provided', () => {
      const cfdi = new Cfdi4Request({
        ...validData,
        serie: 'A',
        folio: '001',
        condicionesDePago: 'Contado',
      });
      const obj = cfdi.toObject();

      expect(obj.serie).toBe('A');
      expect(obj.folio).toBe('001');
      expect(obj.condiciones_de_pago).toBe('Contado');
    });

    it('should include impuestos when provided', () => {
      const impuestos = new Impuestos({
        totalImpuestosTrasladados: 1600.0,
        traslados: [
          new TrasladoGlobal({
            impuesto: '002',
            tipoFactor: 'Tasa',
            tasaOCuota: 0.16,
            importe: 1600.0,
          }),
        ],
      });

      const cfdi = new Cfdi4Request({
        ...validData,
        impuestos,
      });
      const obj = cfdi.toObject();

      expect(obj.impuestos).toBeDefined();
    });

    it('should serialize fecha as ISO string when Date provided (PHP parity)', () => {
      const fecha = new Date('2026-01-15T10:30:00.000Z');
      const cfdi = new Cfdi4Request({ ...validData, fecha });
      const obj = cfdi.toObject();

      expect(obj.fecha).toBe(fecha.toISOString());
    });

    it('should include confirmacion, cfdi_relacionados, exportacion, informacion_global when provided (PHP parity)', () => {
      const cfdi = new Cfdi4Request({
        ...validData,
        confirmacion: 'ABC',
        exportacion: '02',
        cfdiRelacionados: new CfdiRelacionados({ tipoRelacion: '01', uuids: ['UUID-1'] }),
        informacionGlobal: new InformacionGlobal({
          periodicidad: 'Mensual',
          meses: '01',
          anio: '2026',
        }),
      });
      const obj = cfdi.toObject();

      expect(obj.confirmacion).toBe('ABC');
      expect(obj.exportacion).toBe('02');
      expect(obj.cfdi_relacionados).toEqual({ tipo_relacion: '01', uuids: ['UUID-1'] });
      expect(obj.informacion_global).toEqual({
        periodicidad: 'Mensual',
        meses: '01',
        anio: '2026',
      });
    });
  });

  describe('getters (PHP parity)', () => {
    it('should return emisor and receptor', () => {
      const cfdi = new Cfdi4Request(validData);
      expect(cfdi.getEmisor()).toBe(emisor);
      expect(cfdi.getReceptor()).toBe(receptor);
    });

    it('should return conceptos array', () => {
      const cfdi = new Cfdi4Request(validData);
      expect(cfdi.getConceptos()).toHaveLength(1);
      expect(cfdi.getConceptos()[0]).toBe(concepto);
    });

    it('should return comprobante attributes', () => {
      const cfdi = new Cfdi4Request(validData);
      expect(cfdi.getFormaPago()).toBe('01');
      expect(cfdi.getMetodoPago()).toBe('PUE');
      expect(cfdi.getTipoComprobante()).toBe('I');
      expect(cfdi.getLugarExpedicion()).toBe('06300');
      expect(cfdi.getMoneda()).toBe('MXN');
    });

    it('should return null fecha when omitted', () => {
      const cfdi = new Cfdi4Request(validData);
      expect(cfdi.getFecha()).toBeNull();
    });

    it('should return Date fecha when provided', () => {
      const fecha = new Date('2026-01-15T10:30:00.000Z');
      const cfdi = new Cfdi4Request({ ...validData, fecha });
      expect(cfdi.getFecha()).toBe(fecha);
    });

    it('should return nullable optional getters when omitted', () => {
      const cfdi = new Cfdi4Request(validData);
      expect(cfdi.getSerie()).toBeNull();
      expect(cfdi.getFolio()).toBeNull();
      expect(cfdi.getTipoCambio()).toBeNull();
      expect(cfdi.getImpuestos()).toBeNull();
      expect(cfdi.getConfirmacion()).toBeNull();
      expect(cfdi.getCfdiRelacionados()).toBeNull();
      expect(cfdi.getExportacion()).toBeNull();
      expect(cfdi.getCondicionesPago()).toBeNull();
      expect(cfdi.getDescuento()).toBeNull();
      expect(cfdi.getInformacionGlobal()).toBeNull();
    });

    it('should return optional getters when provided', () => {
      const impuestos = new Impuestos({ totalImpuestosTrasladados: 1600.0 });
      const rel = new CfdiRelacionados({ tipoRelacion: '01', uuids: ['A'] });
      const ig = new InformacionGlobal({ periodicidad: 'Mensual', meses: '01', anio: '2026' });
      const cfdi = new Cfdi4Request({
        ...validData,
        serie: 'A',
        folio: '001',
        tipoCambio: 1.0,
        impuestos,
        confirmacion: 'X',
        cfdiRelacionados: rel,
        exportacion: '02',
        condicionesDePago: 'Contado',
        descuento: 100.0,
        informacionGlobal: ig,
      });

      expect(cfdi.getSerie()).toBe('A');
      expect(cfdi.getFolio()).toBe('001');
      expect(cfdi.getTipoCambio()).toBe(1.0);
      expect(cfdi.getImpuestos()).toBe(impuestos);
      expect(cfdi.getConfirmacion()).toBe('X');
      expect(cfdi.getCfdiRelacionados()).toBe(rel);
      expect(cfdi.getExportacion()).toBe('02');
      expect(cfdi.getCondicionesPago()).toBe('Contado');
      expect(cfdi.getDescuento()).toBe(100.0);
      expect(cfdi.getInformacionGlobal()).toBe(ig);
    });
  });
});
