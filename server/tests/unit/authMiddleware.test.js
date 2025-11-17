const httpMocks = require('node-mocks-http');
const { authenticate } = require('../../src/middleware/authMiddleware');
const { generateToken } = require('../../src/utils/auth');

describe('authenticate middleware', () => {
  it('returns 401 when no authorization header is present', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    authenticate(req, res, () => {});

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toMatchObject({ error: 'Authentication required' });
  });

  it('attaches user to request when token is valid', () => {
    const token = generateToken({ id: 'abc', email: 'abc@test.com' });
    const req = httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 'abc', email: 'abc@test.com' });
  });
});

