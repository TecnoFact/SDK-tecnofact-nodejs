import { AuthenticationException } from '../AuthenticationException';
import { TecnoFactException } from '../TecnoFactException';

describe('AuthenticationException', () => {
  it('should create exception with correct name', () => {
    const exception = new AuthenticationException('Auth failed');
    
    expect(exception.name).toBe('AuthenticationException');
  });

  it('should extend TecnoFactException', () => {
    const exception = new AuthenticationException('Auth failed');
    
    expect(exception).toBeInstanceOf(TecnoFactException);
  });

  it('should preserve message, code and details', () => {
    const details = { reason: 'invalid credentials' };
    const exception = new AuthenticationException('Auth failed', 401, details);
    
    expect(exception.message).toBe('Auth failed');
    expect(exception.code).toBe(401);
    expect(exception.details).toEqual(details);
  });
});
