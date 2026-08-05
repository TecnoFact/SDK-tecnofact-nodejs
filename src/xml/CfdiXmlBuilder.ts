import { Cfdi4Request } from '../models/Cfdi4Request';
import { CfdiRelacionados } from '../models/CfdiRelacionados';
import { Concepto } from '../models/Concepto';
import { DoctoRelacionado } from '../models/DoctoRelacionado';
import { Emisor } from '../models/Emisor';
import { Impuestos } from '../models/Impuestos';
import { ImpuestosConcepto } from '../models/ImpuestosConcepto';
import { InformacionGlobal } from '../models/InformacionGlobal';
import { Pago } from '../models/Pago';
import { PagoRequest } from '../models/PagoRequest';
import { Parte } from '../models/Parte';
import { Receptor } from '../models/Receptor';
import { Retencion } from '../models/Retencion';
import { Traslado } from '../models/Traslado';
import { xmlDocument, XmlElement } from './XmlElement';

export class CfdiXmlBuilder {
  private readonly CFDI_NS = 'http://www.sat.gob.mx/cfd/4';
  private readonly PAGO20_NS = 'http://www.sat.gob.mx/Pagos20';
  private readonly SCHEMA_LOCATION =
    'http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd';
  private readonly SCHEMA_LOCATION_PAGO =
    this.SCHEMA_LOCATION +
    ' http://www.sat.gob.mx/Pagos20 http://www.sat.gob.mx/sitio_internet/cfd/Pagos/Pagos20.xsd';
  private readonly VERSION = '4.0';

  build(cfdi: Cfdi4Request): string {
    const root = new XmlElement('cfdi', 'Comprobante', this.CFDI_NS);
    root.setAttribute('xsi:schemaLocation', this.SCHEMA_LOCATION);
    this.buildComprobanteAttributes(root, cfdi);

    const informacionGlobal = cfdi.getInformacionGlobal();
    if (informacionGlobal !== null) {
      this.appendInformacionGlobal(root, informacionGlobal);
    }

    const cfdiRelacionados = cfdi.getCfdiRelacionados();
    if (cfdiRelacionados !== null) {
      this.appendCfdiRelacionados(root, cfdiRelacionados);
    }

    this.appendEmisor(root, cfdi.getEmisor());
    this.appendReceptor(root, cfdi.getReceptor());
    this.appendConceptos(root, cfdi.getConceptos());

    const impuestos = cfdi.getImpuestos();
    if (impuestos !== null && !this.esTrasladoOPago(cfdi.getTipoComprobante())) {
      this.appendImpuestosGlobales(root, impuestos);
    }

    return xmlDocument(root);
  }

  private buildComprobanteAttributes(node: XmlElement, cfdi: Cfdi4Request): void {
    const tipo = cfdi.getTipoComprobante();
    node.setAttribute('Version', this.VERSION);
    if (cfdi.getSerie() !== null) node.setAttribute('Serie', cfdi.getSerie());
    if (cfdi.getFolio() !== null) node.setAttribute('Folio', cfdi.getFolio());
    const fecha = cfdi.getFecha();
    if (fecha !== null) node.setAttribute('Fecha', this.formatSatDateTime(fecha));
    if (tipo !== 'N') node.setAttribute('FormaPago', cfdi.getFormaPago());
    if ((tipo === 'I' || tipo === 'E') && cfdi.getCondicionesPago() !== null) {
      node.setAttribute('CondicionesDePago', cfdi.getCondicionesPago()!);
    }
    node.setAttribute('SubTotal', this.importe(cfdi.getSubtotal()));
    if (cfdi.getDescuento() !== null) {
      node.setAttribute('Descuento', this.importe(cfdi.getDescuento()!));
    }
    node.setAttribute('Moneda', cfdi.getMoneda());
    if (cfdi.getTipoCambio() !== null) {
      node.setAttribute('TipoCambio', this.cantidad(cfdi.getTipoCambio()!));
    }
    node.setAttribute('Total', this.importe(cfdi.getTotal()));
    node.setAttribute('TipoDeComprobante', tipo);
    node.setAttribute('Exportacion', cfdi.getExportacion() ?? '01');
    if (!this.esTrasladoOPago(tipo)) node.setAttribute('MetodoPago', cfdi.getMetodoPago());
    node.setAttribute('LugarExpedicion', cfdi.getLugarExpedicion());
    if (cfdi.getConfirmacion() !== null) {
      node.setAttribute('Confirmacion', cfdi.getConfirmacion()!);
    }
  }

  private appendInformacionGlobal(parent: XmlElement, info: InformacionGlobal): void {
    const node = new XmlElement('cfdi', 'InformacionGlobal', this.CFDI_NS);
    node.setAttribute('Periodicidad', info.getPeriodicidad());
    node.setAttribute('Meses', info.getMeses());
    node.setAttribute('Año', info.getAnio());
    parent.appendChild(node);
  }

  private appendCfdiRelacionados(parent: XmlElement, rel: CfdiRelacionados): void {
    const node = new XmlElement('cfdi', 'CfdiRelacionados', this.CFDI_NS);
    node.setAttribute('TipoRelacion', rel.getTipoRelacion());
    for (const uuid of rel.getUuids()) {
      const child = new XmlElement('cfdi', 'CfdiRelacionado', this.CFDI_NS);
      child.setAttribute('UUID', uuid);
      node.appendChild(child);
    }
    parent.appendChild(node);
  }

  private appendEmisor(parent: XmlElement, emisor: Emisor): void {
    const node = new XmlElement('cfdi', 'Emisor', this.CFDI_NS);
    node.setAttribute('Rfc', emisor.getRfc());
    node.setAttribute('Nombre', emisor.getNombre());
    node.setAttribute('RegimenFiscal', emisor.getRegimenFiscal());
    if (emisor.getFacAtrAdm() !== null) {
      node.setAttribute('FacAtrAdquirente', emisor.getFacAtrAdm()!);
    }
    parent.appendChild(node);
  }

  private appendReceptor(parent: XmlElement, receptor: Receptor): void {
    const node = new XmlElement('cfdi', 'Receptor', this.CFDI_NS);
    node.setAttribute('Rfc', receptor.getRfc());
    node.setAttribute('Nombre', receptor.getNombre());
    node.setAttribute('DomicilioFiscalReceptor', receptor.getDomicilioFiscalReceptor());
    if (receptor.getResidenciaFiscal() !== null) {
      node.setAttribute('ResidenciaFiscal', receptor.getResidenciaFiscal()!);
    }
    if (receptor.getNumRegIdTrib() !== null) {
      node.setAttribute('NumRegIdTrib', receptor.getNumRegIdTrib()!);
    }
    node.setAttribute('RegimenFiscalReceptor', receptor.getRegimenFiscalReceptor());
    node.setAttribute('UsoCFDI', receptor.getUsoCfdi());
    parent.appendChild(node);
  }

  private appendConceptos(parent: XmlElement, conceptos: Concepto[]): void {
    const node = new XmlElement('cfdi', 'Conceptos', this.CFDI_NS);
    for (const concepto of conceptos) {
      node.appendChild(this.buildConcepto(concepto));
    }
    parent.appendChild(node);
  }

  private buildConcepto(concepto: Concepto): XmlElement {
    const node = new XmlElement('cfdi', 'Concepto', this.CFDI_NS);
    node.setAttribute('ClaveProdServ', concepto.getClaveProdServ());
    if (concepto.getNoIdentificacion() !== null) {
      node.setAttribute('NoIdentificacion', concepto.getNoIdentificacion()!);
    }
    node.setAttribute('Cantidad', this.cantidad(concepto.getCantidad()));
    node.setAttribute('ClaveUnidad', concepto.getClaveUnidad());
    if (concepto.getUnidad() !== null) node.setAttribute('Unidad', concepto.getUnidad()!);
    node.setAttribute('Descripcion', concepto.getDescripcion());
    node.setAttribute('ValorUnitario', this.importe(concepto.getValorUnitario()));
    node.setAttribute('Importe', this.importe(concepto.getImporte()));
    if (concepto.getDescuento() !== null) {
      node.setAttribute('Descuento', this.importe(concepto.getDescuento()!));
    }
    node.setAttribute('ObjetoImp', concepto.getObjetoImp());
    if (concepto.getObjetoImp() === '02' && concepto.getImpuestos() !== null) {
      const impuestos = this.buildConceptoImpuestos(concepto.getImpuestos()!);
      if (impuestos !== null) node.appendChild(impuestos);
    }
    const informacionAduanera = concepto.getInformacionAduanera();
    if (informacionAduanera !== null) {
      const ia = new XmlElement('cfdi', 'InformacionAduanera', this.CFDI_NS);
      ia.setAttribute('NumeroPedimento', informacionAduanera.getNumeroPedimento());
      node.appendChild(ia);
    }
    const cuentaPredial = concepto.getCuentaPredial();
    if (cuentaPredial !== null) {
      const cp = new XmlElement('cfdi', 'CuentaPredial', this.CFDI_NS);
      cp.setAttribute('Numero', cuentaPredial.getNumero());
      node.appendChild(cp);
    }
    const partes = concepto.getPartes();
    if (partes !== null) {
      for (const parte of partes) node.appendChild(this.buildParte(parte));
    }
    return node;
  }

  private buildParte(parte: Parte): XmlElement {
    const node = new XmlElement('cfdi', 'Parte', this.CFDI_NS);
    node.setAttribute('ClaveProdServ', parte.getClaveProdServ());
    if (parte.getNoIdentificacion() !== null) {
      node.setAttribute('NoIdentificacion', parte.getNoIdentificacion()!);
    }
    node.setAttribute('Cantidad', this.cantidad(parte.getCantidad()));
    if (parte.getUnidad() !== null) node.setAttribute('Unidad', parte.getUnidad()!);
    node.setAttribute('Descripcion', parte.getDescripcion());
    if (parte.getValorUnitario() !== null) {
      node.setAttribute('ValorUnitario', this.importe(parte.getValorUnitario()!));
    }
    if (parte.getImporte() !== null) {
      node.setAttribute('Importe', this.importe(parte.getImporte()!));
    }
    return node;
  }

  private buildConceptoImpuestos(impuestos: ImpuestosConcepto): XmlElement | null {
    const traslados = impuestos.getTraslados();
    const retenciones = impuestos.getRetenciones();
    if (traslados.length === 0 && retenciones.length === 0) return null;
    const node = new XmlElement('cfdi', 'Impuestos', this.CFDI_NS);
    if (traslados.length > 0) {
      const trasladosNode = new XmlElement('cfdi', 'Traslados', this.CFDI_NS);
      for (const traslado of traslados) {
        trasladosNode.appendChild(this.buildTrasladoConcepto(traslado));
      }
      node.appendChild(trasladosNode);
    }
    if (retenciones.length > 0) {
      const retencionesNode = new XmlElement('cfdi', 'Retenciones', this.CFDI_NS);
      for (const retencion of retenciones) {
        retencionesNode.appendChild(this.buildRetencionConcepto(retencion));
      }
      node.appendChild(retencionesNode);
    }
    return node;
  }

  private buildTrasladoConcepto(traslado: Traslado): XmlElement {
    const node = new XmlElement('cfdi', 'Traslado', this.CFDI_NS);
    node.setAttribute('Base', this.importe(traslado.getBase()));
    node.setAttribute('Impuesto', traslado.getImpuesto());
    node.setAttribute('TipoFactor', traslado.getTipoFactor());
    if (traslado.getTipoFactor() !== 'Exento') {
      if (traslado.getTasaOCuota() !== null) {
        node.setAttribute('TasaOCuota', String(traslado.getTasaOCuota()!));
      }
      node.setAttribute('Importe', this.importe(traslado.getImporte()));
    }
    return node;
  }

  private buildRetencionConcepto(retencion: Retencion): XmlElement {
    const node = new XmlElement('cfdi', 'Retencion', this.CFDI_NS);
    node.setAttribute('Base', this.importe(retencion.getBase()));
    node.setAttribute('Impuesto', retencion.getImpuesto());
    node.setAttribute('TipoFactor', retencion.getTipoFactor());
    node.setAttribute('TasaOCuota', String(retencion.getTasaOCuota()));
    node.setAttribute('Importe', this.importe(retencion.getImporte()));
    return node;
  }

  private appendImpuestosGlobales(parent: XmlElement, impuestos: Impuestos): void {
    const node = new XmlElement('cfdi', 'Impuestos', this.CFDI_NS);
    const retenciones = impuestos.getRetenciones();
    const traslados = impuestos.getTraslados();
    if (impuestos.getTotalImpuestosRetenidos() !== null) {
      node.setAttribute(
        'TotalImpuestosRetenidos',
        this.importe(impuestos.getTotalImpuestosRetenidos()!)
      );
    }
    if (impuestos.getTotalImpuestosTrasladados() !== null) {
      node.setAttribute(
        'TotalImpuestosTrasladados',
        this.importe(impuestos.getTotalImpuestosTrasladados()!)
      );
    }
    if (retenciones !== null && retenciones.length > 0) {
      const retencionesNode = new XmlElement('cfdi', 'Retenciones', this.CFDI_NS);
      for (const retencion of retenciones) {
        const child = new XmlElement('cfdi', 'Retencion', this.CFDI_NS);
        child.setAttribute('Impuesto', retencion.getImpuesto());
        child.setAttribute('Importe', this.importe(retencion.getImporte()));
        retencionesNode.appendChild(child);
      }
      node.appendChild(retencionesNode);
    }
    if (traslados !== null && traslados.length > 0) {
      const trasladosNode = new XmlElement('cfdi', 'Traslados', this.CFDI_NS);
      for (const traslado of traslados) {
        const child = new XmlElement('cfdi', 'Traslado', this.CFDI_NS);
        child.setAttribute('Base', this.importe(traslado.getBase()));
        child.setAttribute('Impuesto', traslado.getImpuesto());
        child.setAttribute('TipoFactor', traslado.getTipoFactor());
        if (traslado.getTipoFactor() !== 'Exento') {
          if (traslado.getTasaOCuota() !== null) {
            child.setAttribute('TasaOCuota', String(traslado.getTasaOCuota()!));
          }
          if (traslado.getImporte() !== null) {
            child.setAttribute('Importe', this.importe(traslado.getImporte()!));
          }
        }
        trasladosNode.appendChild(child);
      }
      node.appendChild(trasladosNode);
    }
    parent.appendChild(node);
  }

  buildPago(request: PagoRequest): string {
    const root = new XmlElement('cfdi', 'Comprobante', this.CFDI_NS);
    root.declareNamespace('pago20', this.PAGO20_NS);
    root.setAttribute('xsi:schemaLocation', this.SCHEMA_LOCATION_PAGO);
    this.buildComprobanteAtributosPago(root, request);
    this.appendEmisor(root, request.getEmisor());
    this.appendReceptor(root, request.getReceptor());
    this.appendConceptoFijoPago(root);
    this.appendComplementoPago(root, request.getPagos());
    return xmlDocument(root);
  }

  private buildComprobanteAtributosPago(node: XmlElement, request: PagoRequest): void {
    node.setAttribute('Version', this.VERSION);
    if (request.getSerie() !== null) node.setAttribute('Serie', request.getSerie());
    if (request.getFolio() !== null) node.setAttribute('Folio', request.getFolio());
    node.setAttribute('Fecha', this.formatSatDateTime(request.getFecha()));
    node.setAttribute('SubTotal', '0');
    node.setAttribute('Moneda', 'XXX');
    node.setAttribute('Total', '0');
    node.setAttribute('TipoDeComprobante', 'P');
    node.setAttribute('Exportacion', request.getExportacion());
    node.setAttribute('LugarExpedicion', request.getLugarExpedicion());
  }

  private appendConceptoFijoPago(parent: XmlElement): void {
    const conceptos = new XmlElement('cfdi', 'Conceptos', this.CFDI_NS);
    const concepto = new XmlElement('cfdi', 'Concepto', this.CFDI_NS);
    concepto.setAttribute('ClaveProdServ', '84111506');
    concepto.setAttribute('Cantidad', '1');
    concepto.setAttribute('ClaveUnidad', 'ACT');
    concepto.setAttribute('Descripcion', 'Pago');
    concepto.setAttribute('ValorUnitario', '0');
    concepto.setAttribute('Importe', '0');
    concepto.setAttribute('ObjetoImp', '01');
    conceptos.appendChild(concepto);
    parent.appendChild(conceptos);
  }

  private appendComplementoPago(parent: XmlElement, pagos: Pago[]): void {
    const complemento = new XmlElement('cfdi', 'Complemento', this.CFDI_NS);
    const pagosNode = new XmlElement('pago20', 'Pagos', this.PAGO20_NS);
    pagosNode.setAttribute('Version', '2.0');
    const totales = new XmlElement('pago20', 'Totales', this.PAGO20_NS);
    const montoTotal = pagos.reduce((carry, p) => carry + Number(p.getMonto()), 0);
    totales.setAttribute('MontoTotalPagos', this.importe(montoTotal));
    pagosNode.appendChild(totales);
    for (const pago of pagos) pagosNode.appendChild(this.buildPagoNode(pago));
    complemento.appendChild(pagosNode);
    parent.appendChild(complemento);
  }

  private buildPagoNode(pago: Pago): XmlElement {
    const node = new XmlElement('pago20', 'Pago', this.PAGO20_NS);
    node.setAttribute('FechaPago', this.formatSatDateTime(pago.getFechaPago()));
    node.setAttribute('FormaDePagoP', pago.getFormaDePagoP());
    node.setAttribute('MonedaP', pago.getMonedaP());
    node.setAttribute('TipoCambioP', pago.getTipoCambioP());
    node.setAttribute('Monto', pago.getMonto());
    for (const docto of pago.getDoctosRelacionados()) {
      node.appendChild(this.buildDoctoRelacionado(docto));
    }
    return node;
  }

  private buildDoctoRelacionado(docto: DoctoRelacionado): XmlElement {
    const node = new XmlElement('pago20', 'DoctoRelacionado', this.PAGO20_NS);
    node.setAttribute('IdDocumento', docto.getIdDocumento());
    if (docto.getSerie() !== null) node.setAttribute('Serie', docto.getSerie()!);
    if (docto.getFolio() !== null) node.setAttribute('Folio', docto.getFolio()!);
    node.setAttribute('MonedaDR', docto.getMonedaDR());
    node.setAttribute('EquivalenciaDR', docto.getEquivalenciaDR());
    node.setAttribute('NumParcialidad', String(docto.getNumParcialidad()));
    node.setAttribute('ImpSaldoAnt', docto.getImpSaldoAnt());
    node.setAttribute('ImpPagado', docto.getImpPagado());
    node.setAttribute('ImpSaldoInsoluto', docto.getImpSaldoInsoluto());
    node.setAttribute('ObjetoImpDR', docto.getObjetoImpDR());
    return node;
  }

  private esTrasladoOPago(tipoComprobante: string): boolean {
    return tipoComprobante === 'T' || tipoComprobante === 'P';
  }

  private importe(value: number | string | null | undefined): string {
    return Number(value ?? 0).toFixed(2);
  }

  private cantidad(value: number | string): string {
    let formatted = Number(value).toFixed(6);
    if (formatted.includes('.')) {
      formatted = formatted.replace(/0+$/, '').replace(/\.$/, '');
    }
    return formatted === '' ? '0' : formatted;
  }

  private formatSatDateTime(date: Date): string {
    const pad = (n: number): string => String(n).padStart(2, '0');
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    );
  }
}
