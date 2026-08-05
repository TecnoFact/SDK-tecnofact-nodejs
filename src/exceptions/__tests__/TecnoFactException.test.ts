import { TecnoFactException } from '../TecnoFactException';

describe('TecnoFactException', () => {
  it('crea la excepción solo con mensaje y aplica defaults', () => {
    const exception = new TecnoFactException('Test error');

    expect(exception.message).toBe('Test error');
    expect(exception.code).toBe(0);
    expect(exception.getRequestId()).toBeNull();
    expect(exception.getPrevious()).toBeNull();
    expect(exception.details).toEqual({});
    expect(exception.getDetails()).toEqual({});
  });

  it('acepta message y code', () => {
    const exception = new TecnoFactException('Test error', 400);

    expect(exception.message).toBe('Test error');
    expect(exception.code).toBe(400);
    expect(exception.getRequestId()).toBeNull();
  });

  it('acepta previous y requestId', () => {
    const cause = new Error('boom');
    const exception = new TecnoFactException('wrapped', 500, cause, 'req-123');

    expect(exception.code).toBe(500);
    expect(exception.getPrevious()).toBe(cause);
    expect(exception.getRequestId()).toBe('req-123');
  });

  it('getRequestId devuelve null cuando se omite', () => {
    const exception = new TecnoFactException('Test', 500);
    expect(exception.getRequestId()).toBeNull();
  });

  it('toString incluye el código cuando está presente', () => {
    const exception = new TecnoFactException('Test error', 500);
    expect(exception.toString()).toBe('[500] Test error');
  });

  it('toString devuelve solo el mensaje cuando no hay código', () => {
    const exception = new TecnoFactException('Test error');
    expect(exception.toString()).toBe('Test error');
  });

  it('es instancia de Error', () => {
    const exception = new TecnoFactException('Test');
    expect(exception).toBeInstanceOf(Error);
  });

  it('tiene el nombre correcto', () => {
    const exception = new TecnoFactException('Test');
    expect(exception.name).toBe('TecnoFactException');
  });
});
