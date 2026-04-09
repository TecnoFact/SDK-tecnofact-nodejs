import { Receptor } from '../Receptor';

describe('Receptor', () => {
  const validData = {
    rfc: 'XAXX010101001',
    nombre: 'CLIENTE RECEPTOR',
    usoCfdi: 'G03',
    domicilioFiscalReceptor: '06300',
    regimenFiscalReceptor: '612',
  };

  describe('constructor', () => {
    it('should create receptor with required fields', () => {
      const receptor = new Receptor(validData);
      
      expect(receptor.getRfc()).toBe('XAXX010101001');
      expect(receptor.getNombre()).toBe('CLIENTE RECEPTOR');
      expect(receptor.getUsoCfdi()).toBe('G03');
    });

    it('should create receptor with optional fields', () => {
      const receptor = new Receptor({
        ...validData,
        residenciaFiscal: 'USA',
        numRegIdTrib: '123456789',
      });
      
      expect(receptor.getRfc()).toBe('XAXX010101001');
    });
  });

  describe('toObject', () => {
    it('should return object with required fields only', () => {
      const receptor = new Receptor(validData);
      const obj = receptor.toObject();
      
      expect(obj).toEqual({
        rfc: 'XAXX010101001',
        nombre: 'CLIENTE RECEPTOR',
        uso_cfdi: 'G03',
        domicilio_fiscal_receptor: '06300',
        regimen_fiscal_receptor: '612',
      });
    });

    it('should include optional fields when provided', () => {
      const receptor = new Receptor({
        ...validData,
        residenciaFiscal: 'USA',
        numRegIdTrib: '123456789',
      });
      const obj = receptor.toObject();
      
      expect(obj).toEqual({
        rfc: 'XAXX010101001',
        nombre: 'CLIENTE RECEPTOR',
        uso_cfdi: 'G03',
        domicilio_fiscal_receptor: '06300',
        regimen_fiscal_receptor: '612',
        residencia_fiscal: 'USA',
        num_reg_id_trib: '123456789',
      });
    });
  });
});
