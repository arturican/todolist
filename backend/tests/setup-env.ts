process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT ?? '4000';
process.env.FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
process.env.TRUST_PROXY = process.env.TRUST_PROXY ?? 'true';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'file:./test.db';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test_super_secret_key_123';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
