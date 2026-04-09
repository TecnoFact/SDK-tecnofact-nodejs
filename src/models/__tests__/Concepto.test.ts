import { Concepto } from '../Concepto';
import { ImpuestosConcepto } from '../ImpuestosConcepto';
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
  });
});
