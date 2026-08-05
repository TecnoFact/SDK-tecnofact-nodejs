import { Parte } from '../Parte';

describe('Parte', () => {
  const validData = {
    claveProdServ: '01010101',
    cantidad: 2,
    descripcion: 'Pieza de repuesto',
  };

  describe('constructor', () => {
    it('should create parte with required fields only', () => {
      const parte = new Parte(validData);

      expect(parte.getClaveProdServ()).toBe('01010101');
      expect(parte.getCantidad()).toBe(2);
      expect(parte.getDescripcion()).toBe('Pieza de repuesto');
      expect(parte.getUnidad()).toBeNull();
      expect(parte.getNoIdentificacion()).toBeNull();
      expect(parte.getValorUnitario()).toBeNull();
      expect(parte.getImporte()).toBeNull();
    });

    it('should create parte with optional fields', () => {
      const parte = new Parte({
        ...validData,
        unidad: 'E48',
        noIdentificacion: 'P-001',
        valorUnitario: 50.5,
        importe: 101.0,
      });

      expect(parte.getUnidad()).toBe('E48');
      expect(parte.getNoIdentificacion()).toBe('P-001');
      expect(parte.getValorUnitario()).toBe(50.5);
      expect(parte.getImporte()).toBe(101.0);
    });
  });

  describe('toObject', () => {
    it('should return object with required keys only', () => {
      const parte = new Parte(validData);
      const obj = parte.toObject();

      expect(obj).toEqual({
        clave_prod_serv: '01010101',
        cantidad: 2,
        descripcion: 'Pieza de repuesto',
      });
      expect(obj).not.toHaveProperty('unidad');
      expect(obj).not.toHaveProperty('no_identificacion');
      expect(obj).not.toHaveProperty('valor_unitario');
      expect(obj).not.toHaveProperty('importe');
    });

    it('should include optional keys when defined', () => {
      const parte = new Parte({
        ...validData,
        unidad: 'E48',
        noIdentificacion: 'P-001',
        valorUnitario: 50.5,
        importe: 101.0,
      });
      const obj = parte.toObject();

      expect(obj).toEqual({
        clave_prod_serv: '01010101',
        cantidad: 2,
        descripcion: 'Pieza de repuesto',
        unidad: 'E48',
        no_identificacion: 'P-001',
        valor_unitario: 50.5,
        importe: 101.0,
      });
    });

    it('should include zero values for optional numeric fields', () => {
      const parte = new Parte({ ...validData, valorUnitario: 0, importe: 0 });
      const obj = parte.toObject();

      expect(obj.valor_unitario).toBe(0);
      expect(obj.importe).toBe(0);
    });
  });

  describe('getters', () => {
    it('should return correct clave prod serv', () => {
      const parte = new Parte(validData);
      expect(parte.getClaveProdServ()).toBe('01010101');
    });

    it('should return correct cantidad', () => {
      const parte = new Parte(validData);
      expect(parte.getCantidad()).toBe(2);
    });

    it('should return correct descripcion', () => {
      const parte = new Parte(validData);
      expect(parte.getDescripcion()).toBe('Pieza de repuesto');
    });

    it('should return null unidad when not set', () => {
      const parte = new Parte(validData);
      expect(parte.getUnidad()).toBeNull();
    });

    it('should return null valor unitario when not set', () => {
      const parte = new Parte(validData);
      expect(parte.getValorUnitario()).toBeNull();
    });

    it('should return null importe when not set', () => {
      const parte = new Parte(validData);
      expect(parte.getImporte()).toBeNull();
    });
  });
});
