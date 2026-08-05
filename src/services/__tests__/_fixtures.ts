import { Cfdi4Request } from '../../models/Cfdi4Request';
import { Concepto } from '../../models/Concepto';
import { DoctoRelacionado } from '../../models/DoctoRelacionado';
import { Emisor } from '../../models/Emisor';
import { Pago } from '../../models/Pago';
import { PagoRequest } from '../../models/PagoRequest';
import { Receptor } from '../../models/Receptor';
import { Config } from '../../config';
import { Environment } from '../../enums';
import { IHttpClient } from '../../contracts';

export function makeMockHttpClient(): jest.Mocked<IHttpClient> {
  return {
    get: jest.fn(),
    post: jest.fn(),
    postMultipart: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
}

export function makeConfig(token: string | null = null): Config {
  const config = new Config({
    email: 'user@tecnofact.com',
    password: 'secret',
    environment: Environment.PRODUCTION,
  });
  if (token !== null) {
    config.setToken(token);
  }
  return config;
}

export function makeEmisor(): Emisor {
  return new Emisor({
    rfc: 'XEXX010101000',
    nombre: 'EMISOR',
    regimenFiscal: '601',
    cp: '06300',
  });
}

export function makeReceptor(): Receptor {
  return new Receptor({
    rfc: 'XAXX010101000',
    nombre: 'RECEPTOR',
    usoCfdi: 'G01',
    domicilioFiscalReceptor: '06300',
    regimenFiscalReceptor: '601',
  });
}

export function makeConcepto(): Concepto {
  return new Concepto({
    claveProdServ: '50211502',
    cantidad: 1,
    claveUnidad: 'H87',
    descripcion: 'Producto',
    valorUnitario: 10000,
    importe: 10000,
    objetoImp: '02',
  });
}

export function makeCfdi(): Cfdi4Request {
  return new Cfdi4Request({
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
    fecha: new Date(2024, 0, 15, 13, 30, 45),
  });
}

export function makePagoRequest(): PagoRequest {
  return new PagoRequest({
    emisor: makeEmisor(),
    receptor: makeReceptor(),
    pagos: [
      new Pago({
        fechaPago: new Date(2024, 0, 15, 13, 30, 45),
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
    fecha: new Date(2024, 0, 15, 13, 30, 45),
    lugarExpedicion: '06300',
  });
}
