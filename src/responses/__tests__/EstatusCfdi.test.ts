import { EstatusCfdi } from '../EstatusCfdi';

describe('EstatusCfdi', () => {
  const fullPayload = {
    success: true,
    data: {
      estado: 'Vigente',
      codigo: 'S - Comprobante obtenido',
      es_cancellable: 'No cancelable',
      estatus_cancelacion: 'En proceso',
      efos: '200',
    },
  };

  describe('fromResponse (happy path)', () => {
    it('should extract all fields from a full payload', () => {
      const estatus = EstatusCfdi.fromResponse(fullPayload);

      expect(estatus.isSuccess()).toBe(true);
      expect(estatus.getEstado()).toBe('Vigente');
      expect(estatus.getCodigo()).toBe('S - Comprobante obtenido');
      expect(estatus.getEsCancelable()).toBe('No cancelable');
      expect(estatus.getEstatusCancelacion()).toBe('En proceso');
      expect(estatus.getEfos()).toBe('200');
    });
  });

  describe('fromResponse (defensive / missing fields)', () => {
    it('should default to safe values when payload is empty', () => {
      const estatus = EstatusCfdi.fromResponse({});

      expect(estatus.isSuccess()).toBe(false);
      expect(estatus.getEstado()).toBeNull();
      expect(estatus.getCodigo()).toBeNull();
      expect(estatus.getEsCancelable()).toBeNull();
      expect(estatus.getEstatusCancelacion()).toBeNull();
      expect(estatus.getEfos()).toBeNull();
    });

    it('should default to safe values when data is missing', () => {
      const estatus = EstatusCfdi.fromResponse({ success: false });

      expect(estatus.isSuccess()).toBe(false);
      expect(estatus.getEstado()).toBeNull();
    });

    it('should ignore non-object data', () => {
      const estatus = EstatusCfdi.fromResponse({ success: true, data: 42 });

      expect(estatus.getEstado()).toBeNull();
    });
  });

  describe('fromResponse (snake_case mapping)', () => {
    it('should read es_cancellable from data', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { es_cancellable: 'Cancelable sin aceptación' },
      });

      expect(estatus.getEsCancelable()).toBe('Cancelable sin aceptación');
    });

    it('should read estatus_cancelacion from data', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { estatus_cancelacion: 'Cancelado con aceptación' },
      });

      expect(estatus.getEstatusCancelacion()).toBe('Cancelado con aceptación');
    });

    it('should read efos from data', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { efos: '100' },
      });

      expect(estatus.getEfos()).toBe('100');
    });
  });

  describe('isVigente', () => {
    it('should be true when estado is exactly Vigente', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { estado: 'Vigente' },
      });

      expect(estatus.isVigente()).toBe(true);
    });

    it('should be true when estado is vigente (lowercase)', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { estado: 'vigente' },
      });

      expect(estatus.isVigente()).toBe(true);
    });

    it('should be true when estado is VIGENTE (uppercase)', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { estado: 'VIGENTE' },
      });

      expect(estatus.isVigente()).toBe(true);
    });

    it('should be false when estado is Cancelado', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { estado: 'Cancelado' },
      });

      expect(estatus.isVigente()).toBe(false);
    });

    it('should be false when estado is null', () => {
      const estatus = EstatusCfdi.fromResponse({ success: true });

      expect(estatus.isVigente()).toBe(false);
    });
  });

  describe('getRaw', () => {
    it('should return the exact input object reference', () => {
      const payload = { success: true, data: { estado: 'Vigente' } };
      const estatus = EstatusCfdi.fromResponse(payload);

      expect(estatus.getRaw()).toBe(payload);
    });
  });

  describe('asString coercion', () => {
    it('should coerce numbers to strings', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { estado: 1 },
      });

      expect(estatus.getEstado()).toBe('1');
    });

    it('should coerce booleans to strings', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { estado: true },
      });

      expect(estatus.getEstado()).toBe('true');
    });

    it('should return null for objects', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { estado: { nested: 'object' } },
      });

      expect(estatus.getEstado()).toBeNull();
    });

    it('should return null for null', () => {
      const estatus = EstatusCfdi.fromResponse({
        success: true,
        data: { estado: null },
      });

      expect(estatus.getEstado()).toBeNull();
    });
  });
});
