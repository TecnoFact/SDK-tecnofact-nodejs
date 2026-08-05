import { ResultadoTimbrado } from '../ResultadoTimbrado';

describe('ResultadoTimbrado', () => {
  const fullPayload = {
    success: true,
    code: 200,
    message: 'Timbrado exitoso',
    data: {
      uuid: 'AAA-BBB-CCC',
      xml_timbrado: '<tfd/>',
    },
  };

  describe('fromResponse (happy path)', () => {
    it('should extract all fields from a full payload', () => {
      const resultado = ResultadoTimbrado.fromResponse(fullPayload);

      expect(resultado.isSuccess()).toBe(true);
      expect(resultado.getCode()).toBe(200);
      expect(resultado.getMessage()).toBe('Timbrado exitoso');
      expect(resultado.getUuid()).toBe('AAA-BBB-CCC');
      expect(resultado.getXmlTimbrado()).toBe('<tfd/>');
    });
  });

  describe('fromResponse (defensive / missing fields)', () => {
    it('should default to safe values when payload is empty', () => {
      const resultado = ResultadoTimbrado.fromResponse({});

      expect(resultado.isSuccess()).toBe(false);
      expect(resultado.getCode()).toBeNull();
      expect(resultado.getMessage()).toBeNull();
      expect(resultado.getXmlTimbrado()).toBeNull();
      expect(resultado.getUuid()).toBeNull();
    });

    it('should default to safe values when data is missing', () => {
      const resultado = ResultadoTimbrado.fromResponse({ success: false });

      expect(resultado.isSuccess()).toBe(false);
      expect(resultado.getXmlTimbrado()).toBeNull();
    });

    it('should ignore non-object data', () => {
      const resultado = ResultadoTimbrado.fromResponse({ success: true, data: 'nope' });

      expect(resultado.getXmlTimbrado()).toBeNull();
    });
  });

  describe('fromResponse (top-level fallbacks)', () => {
    it('should prefer top-level xml_timbrado over data.xml', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        xml_timbrado: '<top/>',
        data: { xml: '<data/>' },
      });

      expect(resultado.getXmlTimbrado()).toBe('<top/>');
    });

    it('should fall back to data.xml when xml_timbrado is absent', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        data: { xml: '<data/>' },
      });

      expect(resultado.getXmlTimbrado()).toBe('<data/>');
    });

    it('should fall back to error when message is absent', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: false,
        error: 'Timbrado falló',
      });

      expect(resultado.getMessage()).toBe('Timbrado falló');
    });

    it('should prefer top-level message over error', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: false,
        message: 'Mensaje',
        error: 'Error',
      });

      expect(resultado.getMessage()).toBe('Mensaje');
    });
  });

  describe('getRaw', () => {
    it('should return the exact input object reference', () => {
      const payload = { success: true, data: { uuid: 'x' } };
      const resultado = ResultadoTimbrado.fromResponse(payload);

      expect(resultado.getRaw()).toBe(payload);
    });
  });

  describe('asString coercion', () => {
    it('should coerce numbers to strings', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        data: { uuid: 99 },
      });

      expect(resultado.getUuid()).toBe('99');
    });

    it('should coerce booleans to strings', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        data: { uuid: true },
      });

      expect(resultado.getUuid()).toBe('true');
    });

    it('should return null for objects', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        data: { uuid: { nested: 'object' } },
      });

      expect(resultado.getUuid()).toBeNull();
    });

    it('should return null for null', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        data: { uuid: null },
      });

      expect(resultado.getUuid()).toBeNull();
    });
  });

  describe('Codigo numeric conversion', () => {
    it('should convert string code to number', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        code: '200',
      });

      expect(resultado.getCode()).toBe(200);
    });

    it('should keep numeric code as number', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        code: 404,
      });

      expect(resultado.getCode()).toBe(404);
    });

    it('should return null when code is an object', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        code: { weird: true },
      });

      expect(resultado.getCode()).toBeNull();
    });

    it('should return null when code is missing', () => {
      const resultado = ResultadoTimbrado.fromResponse({ success: true });

      expect(resultado.getCode()).toBeNull();
    });

    it('should return null when code is a non-numeric string', () => {
      const resultado = ResultadoTimbrado.fromResponse({
        success: true,
        code: 'not-a-number',
      });

      expect(resultado.getCode()).toBeNull();
    });
  });
});
