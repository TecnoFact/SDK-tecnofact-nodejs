import { InformacionAduanera } from '../InformacionAduanera';

describe('InformacionAduanera', () => {
  const validData = {
    numeroPedimento: '15  48  3009  0001234',
  };

  describe('constructor', () => {
    it('should create informacion aduanera with valid data', () => {
      const info = new InformacionAduanera(validData);

      expect(info.getNumeroPedimento()).toBe('15  48  3009  0001234');
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys', () => {
      const info = new InformacionAduanera(validData);
      const obj = info.toObject();

      expect(obj).toEqual({
        numero_pedimento: '15  48  3009  0001234',
      });
    });
  });

  describe('getters', () => {
    it('should return correct numero pedimento', () => {
      const info = new InformacionAduanera(validData);
      expect(info.getNumeroPedimento()).toBe('15  48  3009  0001234');
    });
  });
});
