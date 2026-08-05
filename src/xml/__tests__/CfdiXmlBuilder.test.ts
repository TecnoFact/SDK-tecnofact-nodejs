import { CfdiXmlBuilder } from '../CfdiXmlBuilder';
import { Cfdi4Request } from '../../models/Cfdi4Request';
import { CfdiRelacionados } from '../../models/CfdiRelacionados';
import { Concepto } from '../../models/Concepto';
import { CuentaPredial } from '../../models/CuentaPredial';
import { DoctoRelacionado } from '../../models/DoctoRelacionado';
import { Emisor } from '../../models/Emisor';
import { Impuestos } from '../../models/Impuestos';
import { ImpuestosConcepto } from '../../models/ImpuestosConcepto';
import { InformacionAduanera } from '../../models/InformacionAduanera';
import { InformacionGlobal } from '../../models/InformacionGlobal';
import { Pago } from '../../models/Pago';
import { PagoRequest } from '../../models/PagoRequest';
import { Parte } from '../../models/Parte';
import { Receptor } from '../../models/Receptor';
import { Retencion } from '../../models/Retencion';
import { Traslado } from '../../models/Traslado';
import { TrasladoGlobal } from '../../models/TrasladoGlobal';

const builder = new CfdiXmlBuilder();

function makeEmisor(over: Partial<ConstructorParameters<typeof Emisor>[0]> = {}): Emisor {
  return new Emisor({
    rfc: 'XEXX010101000',
    nombre: 'EMISOR',
    regimenFiscal: '601',
    cp: '06300',
    facAtrAdm: over.facAtrAdm,
  });
}

function makeReceptor(over: Partial<ConstructorParameters<typeof Receptor>[0]> = {}): Receptor {
  return new Receptor({
    rfc: 'XAXX010101000',
    nombre: 'RECEPTOR',
    usoCfdi: 'G01',
    domicilioFiscalReceptor: '06300',
    regimenFiscalReceptor: '601',
    residenciaFiscal: over.residenciaFiscal,
    numRegIdTrib: over.numRegIdTrib,
  });
}

function makeConcepto(over: Partial<ConstructorParameters<typeof Concepto>[0]> = {}): Concepto {
  return new Concepto({
    claveProdServ: '50211502',
    cantidad: 1,
    claveUnidad: 'H87',
    descripcion: 'Producto',
    valorUnitario: 10000,
    importe: 10000,
    objetoImp: '02',
    impuestos: over.impuestos,
    noIdentificacion: over.noIdentificacion,
    unidad: over.unidad,
    descuento: over.descuento,
    cuentaPredial: over.cuentaPredial,
    partes: over.partes,
    informacionAduanera: over.informacionAduanera,
  });
}

const FIXED_DATE = new Date(2024, 0, 15, 13, 30, 45);
const FIXED_DATE_STR = '2024-01-15T13:30:45';

describe('CfdiXmlBuilder', () => {
  describe('build()', () => {
    it('1. minimal CFDI tipo I — exact XML', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [makeConcepto()],
        tipoComprobante: 'I',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
      });

      const xml = builder.build(cfdi);

      expect(xml).toBe(
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<cfdi:Comprobante xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd" Version="4.0" Fecha="' +
          FIXED_DATE_STR +
          '" FormaPago="01" SubTotal="10000.00" Moneda="MXN" Total="11600.00" TipoDeComprobante="I" Exportacion="01" MetodoPago="PUE" LugarExpedicion="06300">' +
          '<cfdi:Emisor Rfc="XEXX010101000" Nombre="EMISOR" RegimenFiscal="601"/>' +
          '<cfdi:Receptor Rfc="XAXX010101000" Nombre="RECEPTOR" DomicilioFiscalReceptor="06300" RegimenFiscalReceptor="601" UsoCFDI="G01"/>' +
          '<cfdi:Conceptos><cfdi:Concepto ClaveProdServ="50211502" Cantidad="1" ClaveUnidad="H87" Descripcion="Producto" ValorUnitario="10000.00" Importe="10000.00" ObjetoImp="02"/></cfdi:Conceptos>' +
          '</cfdi:Comprobante>'
      );
    });

    it('2. emits optional Serie/Folio/CondicionesDePago/Descuento/TipoCambio/Confirmacion', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [makeConcepto()],
        tipoComprobante: 'I',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
        serie: 'A',
        folio: '1',
        condicionesDePago: 'Contado',
        descuento: 1000,
        tipoCambio: 1,
        confirmacion: 'ABC',
      });

      const xml = builder.build(cfdi);
      expect(xml).toContain('Serie="A"');
      expect(xml).toContain('Folio="1"');
      expect(xml).toContain('CondicionesDePago="Contado"');
      expect(xml).toContain('Descuento="1000.00"');
      expect(xml).toContain('TipoCambio="1"');
      expect(xml).toContain('Confirmacion="ABC"');
    });

    it('3. tipo T — FormaPago present, MetodoPago absent', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [makeConcepto()],
        tipoComprobante: 'T',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
      });
      const xml = builder.build(cfdi);
      expect(xml).toContain('FormaPago="01"');
      expect(xml).not.toContain('MetodoPago=');
    });

    it('4. tipo N — FormaPago absent, MetodoPago present', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [makeConcepto()],
        tipoComprobante: 'N',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
      });
      const xml = builder.build(cfdi);
      expect(xml).not.toContain('FormaPago=');
      expect(xml).toContain('MetodoPago="PUE"');
    });

    it('5. tipo P — MetodoPago absent and global Impuestos absent', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [makeConcepto()],
        tipoComprobante: 'P',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
        impuestos: new Impuestos({
          totalImpuestosTrasladados: 1600,
          traslados: [
            new TrasladoGlobal({
              base: 10000,
              impuesto: '002',
              tipoFactor: 'Tasa',
              tasaOCuota: 0.16,
              importe: 1600,
            }),
          ],
        }),
      });
      const xml = builder.build(cfdi);
      expect(xml).not.toContain('MetodoPago=');
      expect(xml).not.toMatch(/<cfdi:Impuestos[^a-z]/);
    });

    it('6. emits InformacionGlobal', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [makeConcepto()],
        tipoComprobante: 'I',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
        informacionGlobal: new InformacionGlobal({ periodicidad: '04', meses: '01', anio: '2024' }),
      });
      const xml = builder.build(cfdi);
      expect(xml).toContain('<cfdi:InformacionGlobal Periodicidad="04" Meses="01" Año="2024"/>');
    });

    it('7. emits CfdiRelacionados with two CfdiRelacionado children', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [makeConcepto()],
        tipoComprobante: 'I',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
        cfdiRelacionados: new CfdiRelacionados({
          tipoRelacion: '01',
          uuids: ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'],
        }),
      });
      const xml = builder.build(cfdi);
      expect(xml).toContain('<cfdi:CfdiRelacionados TipoRelacion="01">');
      expect(xml).toContain('<cfdi:CfdiRelacionado UUID="11111111-1111-1111-1111-111111111111"/>');
      expect(xml).toContain('<cfdi:CfdiRelacionado UUID="22222222-2222-2222-2222-222222222222"/>');
      expect(xml).toContain('</cfdi:CfdiRelacionados>');
    });

    it('8. Concepto Impuestos with Traslado and Retencion (ObjetoImp 02)', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [
          makeConcepto({
            impuestos: new ImpuestosConcepto({
              traslados: [
                new Traslado({
                  base: 10000,
                  impuesto: '002',
                  tipoFactor: 'Tasa',
                  tasaOCuota: 0.16,
                  importe: 1600,
                }),
              ],
              retenciones: [
                new Retencion({
                  base: 10000,
                  impuesto: '001',
                  tipoFactor: 'Tasa',
                  tasaOCuota: 0.04,
                  importe: 400,
                }),
              ],
            }),
          }),
        ],
        tipoComprobante: 'I',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
      });
      const xml = builder.build(cfdi);
      expect(xml).toMatch(
        /<cfdi:Impuestos><cfdi:Traslados><cfdi:Traslado[^>]*\/><\/cfdi:Traslados><cfdi:Retenciones><cfdi:Retencion[^>]*\/><\/cfdi:Retenciones><\/cfdi:Impuestos>/
      );
    });

    it('9. Traslado Exento — no TasaOCuota nor Importe', () => {
      const xml = builder.build(
        new Cfdi4Request({
          emisor: makeEmisor(),
          receptor: makeReceptor(),
          conceptos: [
            makeConcepto({
              impuestos: new ImpuestosConcepto({
                traslados: [
                  new Traslado({ base: 1000, impuesto: '002', tipoFactor: 'Exento', importe: 0 }),
                ],
              }),
            }),
          ],
          tipoComprobante: 'I',
          formaPago: '01',
          metodoPago: 'PUE',
          moneda: 'MXN',
          subtotal: 10000,
          total: 11600,
          lugarExpedicion: '06300',
          fecha: FIXED_DATE,
        })
      );
      expect(xml).toContain('<cfdi:Traslado Base="1000.00" Impuesto="002" TipoFactor="Exento"/>');
    });

    it('10. Concepto with Impuestos, InformacionAduanera, CuentaPredial, Parte in XSD order', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [
          makeConcepto({
            impuestos: new ImpuestosConcepto({
              traslados: [
                new Traslado({
                  base: 10000,
                  impuesto: '002',
                  tipoFactor: 'Tasa',
                  tasaOCuota: 0.16,
                  importe: 1600,
                }),
              ],
            }),
            informacionAduanera: new InformacionAduanera({ numeroPedimento: '1234567890' }),
            cuentaPredial: new CuentaPredial({ numero: '1234567890' }),
            partes: [
              new Parte({
                claveProdServ: '50211502',
                cantidad: 1,
                descripcion: 'Parte',
                valorUnitario: 100,
                importe: 100,
              }),
            ],
          }),
        ],
        tipoComprobante: 'I',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
      });
      const xml = builder.build(cfdi);
      expect(xml).toMatch(/Impuestos.*InformacionAduanera.*CuentaPredial.*Parte/s);
      expect(xml).toContain('<cfdi:InformacionAduanera NumeroPedimento="1234567890"/>');
      expect(xml).toContain('<cfdi:CuentaPredial Numero="1234567890"/>');
      expect(xml).toContain('<cfdi:Parte ClaveProdServ="50211502"');
    });

    it('11. global Impuestos with TotalImpuestosTrasladados and Traslados', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [makeConcepto()],
        tipoComprobante: 'I',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
        impuestos: new Impuestos({
          totalImpuestosTrasladados: 1600,
          traslados: [
            new TrasladoGlobal({
              base: 10000,
              impuesto: '002',
              tipoFactor: 'Tasa',
              tasaOCuota: 0.16,
              importe: 1600,
            }),
          ],
        }),
      });
      const xml = builder.build(cfdi);
      expect(xml).toContain('<cfdi:Impuestos TotalImpuestosTrasladados="1600.00">');
      expect(xml).toContain('<cfdi:Traslados>');
    });
  });

  describe('buildPago()', () => {
    it('12. minimal Pago exactly', () => {
      const request = new PagoRequest({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        pagos: [
          new Pago({
            fechaPago: FIXED_DATE,
            formaDePagoP: '01',
            monedaP: 'MXN',
            monto: '5000.00',
            doctosRelacionados: [
              new DoctoRelacionado({
                idDocumento: '11111111-1111-1111-1111-111111111111',
                monedaDR: 'MXN',
                equivalenciaDR: '1',
                numParcialidad: 1,
                impSaldoAnt: '5000.00',
                impPagado: '5000.00',
                impSaldoInsoluto: '0.00',
                objetoImpDR: '02',
              }),
            ],
          }),
        ],
        fecha: FIXED_DATE,
        lugarExpedicion: '06300',
      });
      const xml = builder.buildPago(request);
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('xmlns:pago20="http://www.sat.gob.mx/Pagos20"');
      expect(xml).toContain('Pagos20.xsd"');
      expect(xml).toContain('SubTotal="0"');
      expect(xml).toContain('Moneda="XXX"');
      expect(xml).toContain('Total="0"');
      expect(xml).toContain('TipoDeComprobante="P"');
      expect(xml).toContain('ClaveProdServ="84111506"');
      expect(xml).toContain('Cantidad="1"');
      expect(xml).toContain('ClaveUnidad="ACT"');
      expect(xml).toContain('Descripcion="Pago"');
      expect(xml).toContain('ValorUnitario="0"');
      expect(xml).toContain('Importe="0"');
      expect(xml).toContain('ObjetoImp="01"');
      expect(xml).toContain('<pago20:Pagos Version="2.0">');
      expect(xml).toContain('MontoTotalPagos="5000.00"');
    });

    it('13. two pagos with doctosRelacionados — MontoTotalPagos sum and attributes', () => {
      const request = new PagoRequest({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        pagos: [
          new Pago({
            fechaPago: FIXED_DATE,
            formaDePagoP: '01',
            monedaP: 'MXN',
            monto: '3000.00',
            doctosRelacionados: [
              new DoctoRelacionado({
                idDocumento: '11111111-1111-1111-1111-111111111111',
                monedaDR: 'MXN',
                equivalenciaDR: '1',
                numParcialidad: 1,
                impSaldoAnt: '5000.00',
                impPagado: '3000.00',
                impSaldoInsoluto: '2000.00',
                objetoImpDR: '02',
                serie: 'A',
                folio: '1',
              }),
            ],
          }),
          new Pago({
            fechaPago: FIXED_DATE,
            formaDePagoP: '03',
            monedaP: 'USD',
            monto: '2000.00',
            doctosRelacionados: [
              new DoctoRelacionado({
                idDocumento: '22222222-2222-2222-2222-222222222222',
                monedaDR: 'USD',
                equivalenciaDR: '1',
                numParcialidad: 1,
                impSaldoAnt: '2000.00',
                impPagado: '2000.00',
                impSaldoInsoluto: '0.00',
                objetoImpDR: '02',
              }),
            ],
          }),
        ],
        fecha: FIXED_DATE,
        lugarExpedicion: '06300',
      });
      const xml = builder.buildPago(request);
      expect(xml).toContain('MontoTotalPagos="5000.00"');
      expect(xml).toContain('FechaPago="' + FIXED_DATE_STR + '"');
      expect(xml).toContain('FormaDePagoP="01"');
      expect(xml).toContain('MonedaP="MXN"');
      expect(xml).toContain('TipoCambioP="1"');
      expect(xml).toContain('Monto="3000.00"');
      expect(xml).toContain('FormaDePagoP="03"');
      expect(xml).toContain('MonedaP="USD"');
      expect(xml).toContain('Monto="2000.00"');
      const firstDocIdx = xml.indexOf('IdDocumento="11111111-1111-1111-1111-111111111111"');
      const firstDocEnd = xml.indexOf('/>', firstDocIdx);
      const firstDoc = xml.slice(firstDocIdx, firstDocEnd + 2);
      expect(firstDoc).toContain('Serie="A"');
      expect(firstDoc).toContain('Folio="1"');
      expect(firstDoc).toContain('NumParcialidad="1"');
      expect(firstDoc).toContain('ImpSaldoAnt="5000.00"');
      expect(firstDoc).toContain('ImpPagado="3000.00"');
      expect(firstDoc).toContain('ImpSaldoInsoluto="2000.00"');
      expect(firstDoc).toContain('ObjetoImpDR="02"');
      const secondDocIdx = xml.indexOf('IdDocumento="22222222-2222-2222-2222-222222222222"');
      const secondDocEnd = xml.indexOf('/>', secondDocIdx);
      const secondDoc = xml.slice(secondDocIdx, secondDocEnd + 2);
      expect(secondDoc).not.toContain('Serie=');
      expect(secondDoc).not.toContain('Folio=');
    });
  });

  describe('formatting helpers (indirect)', () => {
    it('14. importe/cantidad formatting', () => {
      const cfdi = new Cfdi4Request({
        emisor: makeEmisor(),
        receptor: makeReceptor(),
        conceptos: [
          new Concepto({
            claveProdServ: '50211502',
            cantidad: 6,
            claveUnidad: 'H87',
            descripcion: 'Producto',
            valorUnitario: 100,
            importe: 600,
            objetoImp: '02',
          }),
          new Concepto({
            claveProdServ: '50211502',
            cantidad: 1.5,
            claveUnidad: 'H87',
            descripcion: 'Producto',
            valorUnitario: 100,
            importe: 150,
            objetoImp: '02',
          }),
          new Concepto({
            claveProdServ: '50211502',
            cantidad: 0,
            claveUnidad: 'H87',
            descripcion: 'Producto',
            valorUnitario: 0,
            importe: 0,
            objetoImp: '02',
          }),
        ],
        tipoComprobante: 'I',
        formaPago: '01',
        metodoPago: 'PUE',
        moneda: 'MXN',
        subtotal: 10000,
        total: 11600,
        lugarExpedicion: '06300',
        fecha: FIXED_DATE,
        tipoCambio: 1,
      });
      const xml = builder.build(cfdi);
      expect(xml).toContain('SubTotal="10000.00"');
      expect(xml).toContain('TipoCambio="1"');
      expect(xml).toContain('Cantidad="6"');
      expect(xml).not.toContain('6.000000');
      expect(xml).toContain('Cantidad="1.5"');
      expect(xml).toContain('Cantidad="0"');
    });
  });

  describe('Phase A regression — optional model getters reach XML', () => {
    it('15. Emisor.FacAtrAdm and Receptor.ResidenciaFiscal/NumRegIdTrib emitted', () => {
      const xml = builder.build(
        new Cfdi4Request({
          emisor: makeEmisor({ facAtrAdm: '1234' }),
          receptor: makeReceptor({ residenciaFiscal: 'MEX', numRegIdTrib: '12345678' }),
          conceptos: [makeConcepto()],
          tipoComprobante: 'I',
          formaPago: '01',
          metodoPago: 'PUE',
          moneda: 'MXN',
          subtotal: 10000,
          total: 11600,
          lugarExpedicion: '06300',
          fecha: FIXED_DATE,
        })
      );
      expect(xml).toContain('FacAtrAdquirente="1234"');
      expect(xml).toContain('ResidenciaFiscal="MEX"');
      expect(xml).toContain('NumRegIdTrib="12345678"');
    });
  });
});
