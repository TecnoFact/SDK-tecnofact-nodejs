import {
  TecnoFactException,
  AuthenticationException,
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
    });

    it('should create exception with code and details', () => {
      const error = new TimbradoException('Timbrado failed', 'TIMB001', {
        folio: '123',
      });
      expect(error.code).toBe('TIMB001');
      expect(error.getDetails()).toEqual({ folio: '123' });
    });
  });

  describe('CancelacionException', () => {
    it('should create exception with message', () => {
      const error = new CancelacionException('Cancelacion failed');
      expect(error.message).toBe('Cancelacion failed');
      expect(error).toBeInstanceOf(TecnoFactException);
    });

    it('should create exception with code and details', () => {
      const error = new CancelacionException('Cancelacion failed', 'CANC001', {
        uuid: 'abc-123',
      });
      expect(error.code).toBe('CANC001');
      expect(error.getDetails()).toEqual({ uuid: 'abc-123' });
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
