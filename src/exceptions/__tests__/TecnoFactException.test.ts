import { TecnoFactException } from '../TecnoFactException';

describe('TecnoFactException', () => {
  it('should create exception with message only', () => {
    const exception = new TecnoFactException('Test error');
    
    expect(exception.message).toBe('Test error');
    expect(exception.code).toBeUndefined();
    expect(exception.details).toEqual({});
  });

  it('should create exception with message and code', () => {
    const exception = new TecnoFactException('Test error', 400);
    
    expect(exception.message).toBe('Test error');
    expect(exception.code).toBe(400);
    expect(exception.details).toEqual({});
  });

  it('should create exception with message, code and details', () => {
    const details = { field: 'email', reason: 'invalid format' };
    const exception = new TecnoFactException('Validation error', 400, details);
    
    expect(exception.message).toBe('Validation error');
    expect(exception.code).toBe(400);
    expect(exception.details).toEqual(details);
  });

  it('should return formatted string with code', () => {
    const exception = new TecnoFactException('Test error', 500);
    
    expect(exception.toString()).toBe('[500] Test error');
  });

  it('should return message only when no code', () => {
    const exception = new TecnoFactException('Test error');
    
    expect(exception.toString()).toBe('Test error');
  });

  it('should return details via getDetails method', () => {
    const details = { key: 'value' };
    const exception = new TecnoFactException('Test', 400, details);
    
    expect(exception.getDetails()).toEqual(details);
  });

  it('should be instance of Error', () => {
    const exception = new TecnoFactException('Test');
    
    expect(exception).toBeInstanceOf(Error);
  });

  it('should have correct name', () => {
    const exception = new TecnoFactException('Test');
    
    expect(exception.name).toBe('TecnoFactException');
  });
});
