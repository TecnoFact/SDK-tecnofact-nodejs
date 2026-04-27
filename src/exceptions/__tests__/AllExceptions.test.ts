import {
  TecnoFactException,
  ValidationException,
  TimbradoException,
  CancelacionException,
  NotFoundException,
  RateLimitException,
  ServerException,
} from '../index';

describe('All Exceptions', () => {
  describe('TimbradoException', () => {
    it('should create exception with message', () => {
      const error = new TimbradoException('Timbrado failed');
      expect(error.message).toBe('Timbrado failed');
      expect(error).toBeInstanceOf(TecnoFactException);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('TimbradoException');
    });

    it('should create exception with code and details', () => {
      const error = new TimbradoException('Timbrado failed', 1001, {
        folio: '123',
      });
      expect(error.code).toBe(1001);
      expect(error.getDetails()).toEqual({ folio: '123' });
    });

    it('should create exception with only message and code', () => {
      const error = new TimbradoException('Timbrado failed', 1002);
      expect(error.message).toBe('Timbrado failed');
      expect(error.code).toBe(1002);
    });

    it('should have correct toString representation', () => {
      const error = new TimbradoException('Timbrado failed', 1001);
      expect(error.toString()).toContain('[1001]');
      expect(error.toString()).toContain('Timbrado failed');
    });
  });

  describe('CancelacionException', () => {
    it('should create exception with message', () => {
      const error = new CancelacionException('Cancelacion failed');
      expect(error.message).toBe('Cancelacion failed');
      expect(error).toBeInstanceOf(TecnoFactException);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('CancelacionException');
    });

    it('should create exception with code and details', () => {
      const error = new CancelacionException('Cancelacion failed', 2001, {
        uuid: 'abc-123',
      });
      expect(error.code).toBe(2001);
      expect(error.getDetails()).toEqual({ uuid: 'abc-123' });
    });

    it('should create exception with only message and code', () => {
      const error = new CancelacionException('Cancelacion failed', 2002);
      expect(error.message).toBe('Cancelacion failed');
      expect(error.code).toBe(2002);
    });

    it('should have correct toString representation', () => {
      const error = new CancelacionException('Cancelacion failed', 2001);
      expect(error.toString()).toContain('[2001]');
      expect(error.toString()).toContain('Cancelacion failed');
    });
  });

  describe('ValidationException', () => {
    it('should create exception with message', () => {
      const error = new ValidationException('Validation failed');
      expect(error.message).toBe('Validation failed');
      expect(error).toBeInstanceOf(TecnoFactException);
    });
  });

  describe('NotFoundException', () => {
    it('should create exception with message', () => {
      const error = new NotFoundException('Resource not found');
      expect(error.message).toBe('Resource not found');
      expect(error).toBeInstanceOf(TecnoFactException);
    });
  });

  describe('RateLimitException', () => {
    it('should create exception with message', () => {
      const error = new RateLimitException('Rate limit exceeded');
      expect(error.message).toBe('Rate limit exceeded');
      expect(error).toBeInstanceOf(TecnoFactException);
    });
  });

  describe('ServerException', () => {
    it('should create exception with message', () => {
      const error = new ServerException('Server error');
      expect(error.message).toBe('Server error');
      expect(error).toBeInstanceOf(TecnoFactException);
    });
  });
});
