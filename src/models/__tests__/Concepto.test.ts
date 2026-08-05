import { Concepto } from '../Concepto';
import { CuentaPredial } from '../CuentaPredial';
import { ImpuestosConcepto } from '../ImpuestosConcepto';
import { InformacionAduanera } from '../InformacionAduanera';
import { Parte } from '../Parte';
import { Traslado } from '../Traslado';

describe('Concepto', () => {
  const validData = {
    claveProdServ: '01010101',
    cantidad: 1,
    claveUnidad: 'E48',
    descripcion: 'Servicio de desarrollo',
    valorUnitario: 10000.0,
    importe: 10000.0,
    objetoImp: '02',
  };

  describe('constructor', () => {
    it('should create concepto with required fields', () => {
      const concepto = new Concepto(validData);

      expect(concepto).toBeDefined();
    });

    it('should create concepto with impuestos', () => {
      const impuestos = new ImpuestosConcepto({
        traslados: [
          new Traslado({
            base: 10000.0,
            impuesto: '002',
            tipoFactor: 'Tasa',
            tasaOCuota: 0.16,
            importe: 1600.0,
          }),
        ],
      });

      const concepto = new Concepto({
        ...validData,
        impuestos,
      });

      expect(concepto).toBeDefined();
    });
  });

  describe('toObject', () => {
    it('should return object with required fields', () => {
      const concepto = new Concepto(validData);
      const obj = concepto.toObject();

      expect(obj).toEqual({
        clave_prod_serv: '01010101',
        cantidad: 1,
        clave_unidad: 'E48',
        descripcion: 'Servicio de desarrollo',
        valor_unitario: 10000.0,
        importe: 10000.0,
        objeto_imp: '02',
      });
    });

    it('should include optional fields when provided', () => {
      const concepto = new Concepto({
        ...validData,
        noIdentificacion: 'PROD001',
        unidad: 'Servicio',
        descuento: 100.0,
      });
      const obj = concepto.toObject();

      expect(obj.no_identificacion).toBe('PROD001');
      expect(obj.unidad).toBe('Servicio');
      expect(obj.descuento).toBe(100.0);
    });

    it('should include impuestos when provided', () => {
      const impuestos = new ImpuestosConcepto({
        traslados: [
          new Traslado({
            base: 10000.0,
            impuesto: '002',
            tipoFactor: 'Tasa',
            tasaOCuota: 0.16,
            importe: 1600.0,
          }),
        ],
      });

      const concepto = new Concepto({
        ...validData,
        impuestos,
      });
      const obj = concepto.toObject();

      expect(obj.impuestos).toBeDefined();
    });

    it('should include cuenta predial, partes, informacion aduanera (PHP parity)', () => {
      const concepto = new Concepto({
        ...validData,
        cuentaPredial: new CuentaPredial({ numero: '1234567890' }),
        partes: [
          new Parte({
            claveProdServ: '01010101',
            cantidad: 1,
            descripcion: 'Parte A',
          }),
        ],
        informacionAduanera: new InformacionAduanera({ numeroPedimento: '15  1  0001  0001' }),
      });
      const obj = concepto.toObject();

      expect(obj.cuenta_predial).toEqual({ numero: '1234567890' });
      expect(obj.partes).toHaveLength(1);
      expect(obj.informacion_aduanera).toEqual({ numero_pedimento: '15  1  0001  0001' });
    });
  });

  describe('getters (PHP parity)', () => {
    it('should return all primitive getters', () => {
      const concepto = new Concepto({ ...validData, noIdentificacion: 'X', unidad: 'U' });
      expect(concepto.getClaveProdServ()).toBe('01010101');
      expect(concepto.getCantidad()).toBe(1);
      expect(concepto.getClaveUnidad()).toBe('E48');
      expect(concepto.getUnidad()).toBe('U');
      expect(concepto.getDescripcion()).toBe('Servicio de desarrollo');
      expect(concepto.getValorUnitario()).toBe(10000.0);
      expect(concepto.getImporte()).toBe(10000.0);
      expect(concepto.getObjetoImp()).toBe('02');
      expect(concepto.getNoIdentificacion()).toBe('X');
    });

    it('should return null unidad when omitted', () => {
      const concepto = new Concepto(validData);
      expect(concepto.getUnidad()).toBeNull();
    });

    it('should return null descuento when omitted', () => {
      const concepto = new Concepto(validData);
      expect(concepto.getDescuento()).toBeNull();
    });

    it('should return impuestos when provided', () => {
      const imp = new ImpuestosConcepto({});
      const concepto = new Concepto({ ...validData, impuestos: imp });
      expect(concepto.getImpuestos()).toBe(imp);
    });

    it('should return null impuestos when omitted', () => {
      const concepto = new Concepto(validData);
      expect(concepto.getImpuestos()).toBeNull();
    });

    it('should return cuenta predial when provided', () => {
      const cp = new CuentaPredial({ numero: '123' });
      const concepto = new Concepto({ ...validData, cuentaPredial: cp });
      expect(concepto.getCuentaPredial()).toBe(cp);
    });

    it('should return null cuenta predial when omitted', () => {
      const concepto = new Concepto(validData);
      expect(concepto.getCuentaPredial()).toBeNull();
    });

    it('should return partes when provided', () => {
      const partes = [new Parte({ claveProdServ: '01010101', cantidad: 1, descripcion: 'A' })];
      const concepto = new Concepto({ ...validData, partes });
      expect(concepto.getPartes()).toHaveLength(1);
    });

    it('should return null partes when omitted', () => {
      const concepto = new Concepto(validData);
      expect(concepto.getPartes()).toBeNull();
    });

    it('should return informacion aduanera when provided', () => {
      const ia = new InformacionAduanera({ numeroPedimento: 'PED-1' });
      const concepto = new Concepto({ ...validData, informacionAduanera: ia });
      expect(concepto.getInformacionAduanera()).toBe(ia);
    });

    it('should return null informacion aduanera when omitted', () => {
      const concepto = new Concepto(validData);
      expect(concepto.getInformacionAduanera()).toBeNull();
    });
  });
});
