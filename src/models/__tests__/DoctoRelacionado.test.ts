import { DoctoRelacionado } from '../DoctoRelacionado';

describe('DoctoRelacionado', () => {
  const validData = {
    idDocumento: 'b11c22d3-1234-5678-9abc-def012345678',
    monedaDR: 'MXN',
    equivalenciaDR: '1',
    numParcialidad: 1,
    impSaldoAnt: '1000.00',
    impPagado: '500.00',
    impSaldoInsoluto: '500.00',
    objetoImpDR: '02',
  };

  describe('constructor', () => {
    it('should create docto relacionado with valid data', () => {
      const docto = new DoctoRelacionado(validData);

      expect(docto.getIdDocumento()).toBe(validData.idDocumento);
      expect(docto.getMonedaDR()).toBe('MXN');
      expect(docto.getNumParcialidad()).toBe(1);
      expect(docto.getSerie()).toBeNull();
      expect(docto.getFolio()).toBeNull();
    });

    it('should create docto relacionado with optional serie and folio', () => {
      const docto = new DoctoRelacionado({ ...validData, serie: 'A', folio: '10' });

      expect(docto.getSerie()).toBe('A');
      expect(docto.getFolio()).toBe('10');
    });
  });

  describe('toObject', () => {
    it('should return object without optional keys when not defined', () => {
      const docto = new DoctoRelacionado(validData);
      const obj = docto.toObject();

      expect(obj).toEqual({
        id_documento: validData.idDocumento,
        moneda_dr: 'MXN',
        equivalencia_dr: '1',
        num_parcialidad: 1,
        imp_saldo_ant: '1000.00',
        imp_pagado: '500.00',
        imp_saldo_insoluto: '500.00',
        objeto_imp_dr: '02',
      });
      expect(obj).not.toHaveProperty('serie');
      expect(obj).not.toHaveProperty('folio');
    });

    it('should include optional keys when defined', () => {
      const docto = new DoctoRelacionado({ ...validData, serie: 'A', folio: '10' });
      const obj = docto.toObject();

      expect(obj).toEqual({
        id_documento: validData.idDocumento,
        moneda_dr: 'MXN',
        equivalencia_dr: '1',
        num_parcialidad: 1,
        imp_saldo_ant: '1000.00',
        imp_pagado: '500.00',
        imp_saldo_insoluto: '500.00',
        objeto_imp_dr: '02',
        serie: 'A',
        folio: '10',
      });
    });
  });

  describe('getters', () => {
    it('should return correct id documento', () => {
      const docto = new DoctoRelacionado(validData);
      expect(docto.getIdDocumento()).toBe(validData.idDocumento);
    });

    it('should return correct moneda DR', () => {
      const docto = new DoctoRelacionado(validData);
      expect(docto.getMonedaDR()).toBe('MXN');
    });

    it('should return correct equivalencia DR', () => {
      const docto = new DoctoRelacionado(validData);
      expect(docto.getEquivalenciaDR()).toBe('1');
    });

    it('should return correct num parcialidad', () => {
      const docto = new DoctoRelacionado(validData);
      expect(docto.getNumParcialidad()).toBe(1);
    });

    it('should return correct imp saldo ant', () => {
      const docto = new DoctoRelacionado(validData);
      expect(docto.getImpSaldoAnt()).toBe('1000.00');
    });

    it('should return correct imp pagado', () => {
      const docto = new DoctoRelacionado(validData);
      expect(docto.getImpPagado()).toBe('500.00');
    });

    it('should return correct imp saldo insoluto', () => {
      const docto = new DoctoRelacionado(validData);
      expect(docto.getImpSaldoInsoluto()).toBe('500.00');
    });

    it('should return correct objeto imp DR', () => {
      const docto = new DoctoRelacionado(validData);
      expect(docto.getObjetoImpDR()).toBe('02');
    });
  });
});
