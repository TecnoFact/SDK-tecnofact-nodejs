import {
  TecnoFactException,
  ValidationException,
  TimbradoException,
  CancelacionException,
  NotFoundException,
  RateLimitException,
  ServerException,
  AuthenticationException,
} from '../index';

describe('All Exceptions', () => {
  describe('ValidationException', () => {
    it('crea la excepción solo con mensaje (errors=[], requestId=null)', () => {
      const error = new ValidationException('Validation failed');

      expect(error.message).toBe('Validation failed');
      expect(error).toBeInstanceOf(TecnoFactException);
      expect(error.name).toBe('ValidationException');
      expect(error.getErrors()).toEqual([]);
      expect(error.getRequestId()).toBeNull();
    });

    it('acepta errors y requestId', () => {
      const errors = [{ field: 'email', reason: 'invalid' }];
      const error = new ValidationException('Validation failed', errors, 'req-1');

      expect(error.getErrors()).toEqual(errors);
      expect(error.getRequestId()).toBe('req-1');
    });
  });

  describe('NotFoundException', () => {
    it('crea la excepción y aplica defaults', () => {
      const error = new NotFoundException('Not found');

      expect(error.message).toBe('Not found');
      expect(error).toBeInstanceOf(TecnoFactException);
      expect(error.name).toBe('NotFoundException');
      expect(error.getRequestId()).toBeNull();
    });

    it('acepta requestId', () => {
      const error = new NotFoundException('Not found', 'req-2');
      expect(error.getRequestId()).toBe('req-2');
    });
  });

  describe('RateLimitException', () => {
    it('aplica retryAfter=60 por defecto', () => {
      const error = new RateLimitException('Rate limit');

      expect(error.getRetryAfter()).toBe(60);
      expect(error.getRequestId()).toBeNull();
      expect(error.name).toBe('RateLimitException');
    });

    it('acepta retryAfter y requestId', () => {
      const error = new RateLimitException('Rate limit', 120, 'req-3');

      expect(error.getRetryAfter()).toBe(120);
      expect(error.getRequestId()).toBe('req-3');
    });
  });

  describe('ServerException', () => {
    it('aplica statusCode=500 por defecto', () => {
      const error = new ServerException('Server error');

      expect(error.getStatusCode()).toBe(500);
      expect(error.getRequestId()).toBeNull();
      expect(error.name).toBe('ServerException');
    });

    it('acepta statusCode y requestId', () => {
      const error = new ServerException('Server error', 503, 'req-4');

      expect(error.getStatusCode()).toBe(503);
      expect(error.getRequestId()).toBe('req-4');
    });
  });

  describe('TimbradoException', () => {
    it('crea la excepción con mensaje y aplica defaults', () => {
      const error = new TimbradoException('Timbrado failed');

      expect(error.message).toBe('Timbrado failed');
      expect(error).toBeInstanceOf(TecnoFactException);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('TimbradoException');
      expect(error.getRequestId()).toBeNull();
    });

    it('acepta requestId', () => {
      const error = new TimbradoException('Timbrado failed', 'req-5');
      expect(error.getRequestId()).toBe('req-5');
    });
  });

  describe('CancelacionException', () => {
    it('crea la excepción con mensaje y aplica defaults', () => {
      const error = new CancelacionException('Cancelacion failed');

      expect(error.message).toBe('Cancelacion failed');
      expect(error).toBeInstanceOf(TecnoFactException);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('CancelacionException');
      expect(error.getRequestId()).toBeNull();
    });

    it('acepta requestId', () => {
      const error = new CancelacionException('Cancelacion failed', 'req-6');
      expect(error.getRequestId()).toBe('req-6');
    });
  });

  describe('AuthenticationException', () => {
    it('crea la excepción con defaults', () => {
      const error = new AuthenticationException('Auth failed');

      expect(error.name).toBe('AuthenticationException');
      expect(error).toBeInstanceOf(TecnoFactException);
      expect(error.getRequestId()).toBeNull();
    });

    it('acepta requestId', () => {
      const error = new AuthenticationException('Auth failed', 'req-7');
      expect(error.getRequestId()).toBe('req-7');
    });
  });
});
