import { CfdiRelacionados } from '../CfdiRelacionados';

describe('CfdiRelacionados', () => {
  const validData = {
    tipoRelacion: '01',
    uuids: ['a1b2c3d4-1234-5678-9abc-def012345678', 'e5f6g7h8-1234-5678-9abc-def012345678'],
  };

  describe('constructor', () => {
    it('should create cfdi relacionados with valid data', () => {
      const cfdi = new CfdiRelacionados(validData);

      expect(cfdi.getTipoRelacion()).toBe('01');
      expect(cfdi.getUuids()).toEqual(validData.uuids);
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys', () => {
      const cfdi = new CfdiRelacionados(validData);
      const obj = cfdi.toObject();

      expect(obj).toEqual({
        tipo_relacion: '01',
        uuids: validData.uuids,
      });
    });
  });

  describe('getters', () => {
    it('should return correct tipo relacion', () => {
      const cfdi = new CfdiRelacionados(validData);
      expect(cfdi.getTipoRelacion()).toBe('01');
    });

    it('should return correct uuids', () => {
      const cfdi = new CfdiRelacionados(validData);
      expect(cfdi.getUuids()).toEqual(validData.uuids);
    });
  });
});
