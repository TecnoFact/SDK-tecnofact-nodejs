import { Cfdi4Request } from '../Cfdi4Request';
import { Emisor } from '../Emisor';
import { Receptor } from '../Receptor';
import { Concepto } from '../Concepto';
import { Impuestos } from '../Impuestos';
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
  });
});
