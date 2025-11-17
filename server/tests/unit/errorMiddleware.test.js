const httpMocks = require('node-mocks-http');
const { errorHandler, notFound } = require('../../src/middleware/errorMiddleware');

describe('error middleware', () => {
  it('sends 404 for unknown routes', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    notFound(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Resource not found' });
  });

  it('formats unexpected errors', () => {
    const error = new Error('Boom');
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    errorHandler(error, req, res, () => {});

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toMatchObject({ error: 'Boom' });
  });
});

