const jwt = require('jsonwebtoken');
const { generateToken, hashPassword, comparePassword } = require('../../src/utils/auth');

describe('auth utils', () => {
  const user = { id: '123', email: 'test@example.com' };

  it('generates a signed token with user payload', () => {
    const token = generateToken(user);
    const decoded = jwt.decode(token);
    expect(decoded.id).toBe(user.id);
    expect(decoded.email).toBe(user.email);
  });

  it('hashes and compares passwords correctly', async () => {
    const password = 'super-secret';
    const hashed = await hashPassword(password);

    expect(hashed).not.toEqual(password);
    await expect(comparePassword(password, hashed)).resolves.toBe(true);
    await expect(comparePassword('wrong', hashed)).resolves.toBe(false);
  });
});

