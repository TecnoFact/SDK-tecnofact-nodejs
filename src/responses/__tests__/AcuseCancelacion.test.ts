import { AcuseCancelacion } from '../AcuseCancelacion';

describe('AcuseCancelacion', () => {
  const pdfFixture = Buffer.from('fake-pdf-content').toString('base64');

  const fullPayload = {
    success: true,
    data: {
      validado: true,
      uuid: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
      status_sat: '201',
      xml: '<cfdi></cfdi>',
      pdf: pdfFixture,
    },
  };

  describe('fromResponse (happy path)', () => {
    it('should extract all fields from a full payload', () => {
      const acuse = AcuseCancelacion.fromResponse(fullPayload);

      expect(acuse.isSuccess()).toBe(true);
      expect(acuse.isValidado()).toBe(true);
      expect(acuse.getUuid()).toBe('A1B2C3D4-E5F6-7890-ABCD-EF1234567890');
      expect(acuse.getStatusSat()).toBe('201');
      expect(acuse.getXml()).toBe('<cfdi></cfdi>');
      expect(acuse.getPdfBase64()).toBe(pdfFixture);
    });
  });

  describe('fromResponse (defensive / missing fields)', () => {
    it('should default to safe values when payload is empty', () => {
      const acuse = AcuseCancelacion.fromResponse({});

      expect(acuse.isSuccess()).toBe(false);
      expect(acuse.isValidado()).toBe(false);
      expect(acuse.getUuid()).toBeNull();
      expect(acuse.getStatusSat()).toBeNull();
      expect(acuse.getXml()).toBeNull();
      expect(acuse.getPdfBase64()).toBeNull();
    });

    it('should default to safe values when data is missing', () => {
      const acuse = AcuseCancelacion.fromResponse({ success: false });

      expect(acuse.isValidado()).toBe(false);
      expect(acuse.getUuid()).toBeNull();
    });

    it('should ignore non-object data', () => {
      const acuse = AcuseCancelacion.fromResponse({ success: true, data: 'not-an-object' });

      expect(acuse.isValidado()).toBe(false);
      expect(acuse.getUuid()).toBeNull();
    });
  });

  describe('fromResponse (snake_case mapping)', () => {
    it('should read status_sat from data', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { status_sat: '201 Cancelado' },
      });

      expect(acuse.getStatusSat()).toBe('201 Cancelado');
    });

    it('should read pdf from data (not pdfBase64)', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { pdf: pdfFixture },
      });

      expect(acuse.getPdfBase64()).toBe(pdfFixture);
    });
  });

  describe('isAceptadaPorSat', () => {
    it('should be true when statusSat starts with 201', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { status_sat: '201' },
      });

      expect(acuse.isAceptadaPorSat()).toBe(true);
    });

    it('should be true when statusSat starts with 201 and has more text', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { status_sat: '201 Procesado' },
      });

      expect(acuse.isAceptadaPorSat()).toBe(true);
    });

    it('should be false when statusSat does not start with 201', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { status_sat: '200' },
      });

      expect(acuse.isAceptadaPorSat()).toBe(false);
    });

    it('should be false when statusSat is null', () => {
      const acuse = AcuseCancelacion.fromResponse({ success: true });

      expect(acuse.isAceptadaPorSat()).toBe(false);
    });
  });

  describe('getRaw', () => {
    it('should return the exact input object reference', () => {
      const payload = { success: true, data: { uuid: 'x' } };
      const acuse = AcuseCancelacion.fromResponse(payload);

      expect(acuse.getRaw()).toBe(payload);
    });
  });

  describe('getPdfBinario', () => {
    it('should return a Buffer decoding the base64 pdf', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { pdf: pdfFixture },
      });

      const buf = acuse.getPdfBinario();

      expect(buf).not.toBeNull();
      expect(Buffer.isBuffer(buf)).toBe(true);
      expect(buf?.toString('utf8')).toBe('fake-pdf-content');
    });

    it('should return null when there is no pdf', () => {
      const acuse = AcuseCancelacion.fromResponse({ success: true });

      expect(acuse.getPdfBinario()).toBeNull();
    });
  });

  describe('asString coercion', () => {
    it('should coerce numbers to strings', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { uuid: 12345 },
      });

      expect(acuse.getUuid()).toBe('12345');
    });

    it('should coerce booleans to strings', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { uuid: true },
      });

      expect(acuse.getUuid()).toBe('true');
    });

    it('should return null for objects', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { uuid: { nested: 'object' } },
      });

      expect(acuse.getUuid()).toBeNull();
    });

    it('should return null for null', () => {
      const acuse = AcuseCancelacion.fromResponse({
        success: true,
        data: { uuid: null },
      });

      expect(acuse.getUuid()).toBeNull();
    });
  });
});
