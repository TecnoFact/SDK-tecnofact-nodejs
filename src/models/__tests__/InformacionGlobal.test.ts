import { InformacionGlobal } from '../InformacionGlobal';

describe('InformacionGlobal', () => {
  const validData = {
    periodicidad: '01',
    meses: '01',
    anio: '2024',
  };

  describe('constructor', () => {
    it('should create informacion global with valid data', () => {
      const info = new InformacionGlobal(validData);

      expect(info.getPeriodicidad()).toBe('01');
      expect(info.getMeses()).toBe('01');
      expect(info.getAnio()).toBe('2024');
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys', () => {
      const info = new InformacionGlobal(validData);
      const obj = info.toObject();

      expect(obj).toEqual({
        periodicidad: '01',
        meses: '01',
        anio: '2024',
      });
    });
  });

  describe('getters', () => {
    it('should return correct periodicidad', () => {
      const info = new InformacionGlobal(validData);
      expect(info.getPeriodicidad()).toBe('01');
    });

    it('should return correct meses', () => {
      const info = new InformacionGlobal(validData);
      expect(info.getMeses()).toBe('01');
    });

    it('should return correct anio', () => {
      const info = new InformacionGlobal(validData);
      expect(info.getAnio()).toBe('2024');
    });
  });
});
