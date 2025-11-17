process.env.JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

jest.setTimeout(20000);

