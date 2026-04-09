import {
  Config,
  Environment,
  Emisor,
  Receptor,
  Concepto,
  ImpuestosConcepto,
  Traslado,
  Cfdi4Request,
  Impuestos,
  TrasladoGlobal,
  HttpClient,
} from '../src';

async function main(): Promise<void> {
  const config = new Config({
    apiKey: 'TU_API_KEY',
    apiSecret: 'TU_API_SECRET',
    environment: Environment.SANDBOX,
    timeout: 30000,
  });

  console.log('Configuración creada:');
  console.log(`  Entorno: ${config.getEnvironment()}`);
  console.log(`  URL Base: ${config.getBaseUrl()}`);
  console.log(`  Timeout: ${config.getTimeout()} ms\n`);

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
    descripcion: 'Servicio de desarrollo de software',
    valorUnitario: 10000.0,
    importe: 10000.0,
    objetoImp: '02',
    impuestos: new ImpuestosConcepto({
      traslados: [
        new Traslado({
          base: 10000.0,
          impuesto: '002',
          tipoFactor: 'Tasa',
          tasaOCuota: 0.16,
          importe: 1600.0,
        }),
      ],
    }),
  });

  const cfdiRequest = new Cfdi4Request({
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
    impuestos: new Impuestos({
      totalImpuestosTrasladados: 1600.0,
      traslados: [
        new TrasladoGlobal({
          impuesto: '002',
          tipoFactor: 'Tasa',
          tasaOCuota: 0.16,
          importe: 1600.0,
        }),
      ],
    }),
  });

  console.log('CFDI Request creado:');
  console.log(`  Emisor: ${emisor.getNombre()}`);
  console.log(`  Receptor: ${receptor.getNombre()}`);
  console.log(`  Subtotal: $${cfdiRequest.getSubtotal()}`);
  console.log(`  Total: $${cfdiRequest.getTotal()}`);
  console.log('\nDatos completos:');
  console.log(JSON.stringify(cfdiRequest.toObject(), null, 2));

  const httpClient = new HttpClient(config);
  console.log('\nHttpClient creado y listo para usar');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
