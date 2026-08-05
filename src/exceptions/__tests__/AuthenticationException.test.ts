import { AuthenticationException } from '../AuthenticationException';
import { TecnoFactException } from '../TecnoFactException';

describe('AuthenticationException', () => {
  it('tiene el nombre correcto', () => {
    const exception = new AuthenticationException('Auth failed');
    expect(exception.name).toBe('AuthenticationException');
  });

  it('extiende TecnoFactException', () => {
    const exception = new AuthenticationException('Auth failed');
    expect(exception).toBeInstanceOf(TecnoFactException);
    expect(exception).toBeInstanceOf(Error);
  });

  it('preserva el mensaje y aplica defaults', () => {
    const exception = new AuthenticationException('Auth failed');

    expect(exception.message).toBe('Auth failed');
    expect(exception.getRequestId()).toBeNull();
    expect(exception.code).toBe(0);
  });

  it('acepta requestId', () => {
    const exception = new AuthenticationException('Auth failed', 'req-abc');

    expect(exception.getRequestId()).toBe('req-abc');
  });
});
