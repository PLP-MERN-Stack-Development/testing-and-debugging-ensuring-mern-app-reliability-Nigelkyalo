const EventEmitter = require('events');

describe('requestTiming middleware', () => {
  let requestTiming;
  let originalHrTime;

  beforeEach(() => {
    jest.resetModules();
    originalHrTime = process.hrtime.bigint;
    process.hrtime.bigint = jest.fn();
    requestTiming = require('../../src/middleware/requestTiming');
  });

  afterEach(() => {
    process.hrtime.bigint = originalHrTime;
    jest.resetModules();
  });

  it('calls next immediately and logs slow requests', () => {
    const logger = require('../../src/config/logger');
    const warnSpy = jest.spyOn(logger, 'warn').mockImplementation(() => {});

    process.hrtime.bigint
      .mockReturnValueOnce(BigInt(0))
      .mockReturnValueOnce(BigInt(700_000_000)); // 700ms

    const req = { method: 'GET', path: '/test' };
    const res = new EventEmitter();
    res.on = res.on.bind(res);
    const next = jest.fn();

    requestTiming(req, res, next);
    expect(next).toHaveBeenCalled();

    res.emit('finish');
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

