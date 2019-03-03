const Logger = require('../src/Logger');
const LoggerException = require('../src/LoggerException');
const TimeProvider = require('../src/TimeProvider');

/**
 * @type {TimeProvider}
 */
const time = {};

/**
 * @type {null|Logger}
 */
let logger = null;

/**
 * @type {string}
 */
const now = '2000-01-01T00:00:00.000Z';

beforeEach(() => {
    time.now = () => new Date(now);
    logger = new Logger(time);
});

test('uses default time provider', () => {
    const logger = new Logger();
    const handler = { handle: jest.fn() };
    const message = 'message';

    logger.addHandler(handler);
    logger.log(message);

    expect(handler.handle.mock.calls[0][0]).toMatch(new RegExp(`\\[\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\.\\d{3}Z] ${message}`));
});

test('fails if no handler is added', () => {
    expect(() => logger.log('something')).toThrow(LoggerException);
    expect(() => logger.log('something')).toThrow('No logger handler has been added');
});

test('forwards log requests to registered handlers', () => {
    const handler1 = { handle: jest.fn() };
    const handler2 = { handle: jest.fn() };
    const message = 'message';
    const expected = `[${now}] ${message}`;

    logger.addHandler(handler1);
    logger.addHandler(handler2);

    logger.log(message);

    expect(handler1.handle.mock.calls[0][0]).toBe(expected);
    expect(handler2.handle.mock.calls[0][0]).toBe(expected);
});
