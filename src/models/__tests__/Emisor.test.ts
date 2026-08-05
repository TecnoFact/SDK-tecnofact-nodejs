import { Emisor } from '../Emisor';

describe('Emisor', () => {
  const validData = {
    rfc: 'XAXX010101000',
    nombre: 'EMPRESA EMISORA SA DE CV',
    regimenFiscal: '601',
    cp: '06300',
  };

  describe('constructor', () => {
    it('should create emisor with valid data', () => {
      const emisor = new Emisor(validData);

      expect(emisor.getRfc()).toBe('XAXX010101000');
      expect(emisor.getNombre()).toBe('EMPRESA EMISORA SA DE CV');
      expect(emisor.getRegimenFiscal()).toBe('601');
      expect(emisor.getCp()).toBe('06300');
    });

    it('should create emisor with optional FacAtrAdm', () => {
      const emisor = new Emisor({ ...validData, facAtrAdm: '1234567890' });
      expect(emisor.getFacAtrAdm()).toBe('1234567890');
    });
  });

  describe('toObject', () => {
    it('should return object with snake_case keys', () => {
      const emisor = new Emisor(validData);
      const obj = emisor.toObject();

      expect(obj).toEqual({
        rfc: 'XAXX010101000',
        nombre: 'EMPRESA EMISORA SA DE CV',
        regimen_fiscal: '601',
        cp: '06300',
      });
    });

    it('should include facAtrAdm when provided', () => {
      const emisor = new Emisor({ ...validData, facAtrAdm: '1234567890' });
      const obj = emisor.toObject();

      expect(obj.facAtrAdm).toBe('1234567890');
      expect(Object.keys(obj)).toHaveLength(5);
    });

    it('should omit facAtrAdm when not provided', () => {
      const emisor = new Emisor(validData);
      const obj = emisor.toObject();
      expect(obj).not.toHaveProperty('facAtrAdm');
    });
  });

  describe('getters', () => {
    it('should return correct RFC', () => {
      const emisor = new Emisor(validData);
      expect(emisor.getRfc()).toBe('XAXX010101000');
    });

    it('should return correct nombre', () => {
      const emisor = new Emisor(validData);
      expect(emisor.getNombre()).toBe('EMPRESA EMISORA SA DE CV');
    });

    it('should return correct regimen fiscal', () => {
      const emisor = new Emisor(validData);
      expect(emisor.getRegimenFiscal()).toBe('601');
    });

    it('should return correct CP', () => {
      const emisor = new Emisor(validData);
      expect(emisor.getCp()).toBe('06300');
    });

    it('should return null FacAtrAdm when not provided (PHP parity)', () => {
      const emisor = new Emisor(validData);
      expect(emisor.getFacAtrAdm()).toBeNull();
    });

    it('should return FacAtrAdm when provided (PHP parity)', () => {
      const emisor = new Emisor({ ...validData, facAtrAdm: '1' });
      expect(emisor.getFacAtrAdm()).toBe('1');
    });
  });
});
