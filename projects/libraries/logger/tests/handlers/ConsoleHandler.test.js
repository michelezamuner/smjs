const ConsoleHandler = require('../../src/handlers/ConsoleHandler');
const Handler = require('../../src/Handler');
const Console = require('console').Console;
const LoggerException = require('../../src/LoggerException');

/**
 * @type {Object|Console}
 */
const console = {};

beforeEach(() => {
    console.write = jest.fn();
    console.writeError = jest.fn();
});

test('implements interface', () => {
    expect(new ConsoleHandler(console)).toBeInstanceOf(Handler);
});

test('provides fqcn', () => {
    expect(ConsoleHandler.toString()).toBe('Logger.Handlers.ConsoleHandler');
});

test('defaults to write message to STDOUT', () => {
    const handler = new ConsoleHandler(console);
    const message = 'message';

    handler.handle(message);

    expect(console.write.mock.calls[0][0]).toBe(message);
});

test('writes messages to STDOUT', () => {
    const handler = new ConsoleHandler(console, ConsoleHandler.STREAM_STDOUT);
    const message = 'message';

    handler.handle(message);

    expect(console.write.mock.calls[0][0]).toBe(message);
});

test('writes messages to STDERR', () => {
    const handler = new ConsoleHandler(console, ConsoleHandler.STREAM_STDERR);
    const message = 'message';

    handler.handle(message);

    expect(console.writeError.mock.calls[0][0]).toBe(message);
});

test('fails if invalid stream', () => {
    expect(() => new ConsoleHandler(console, 999)).toThrow(LoggerException);
    expect(() => new ConsoleHandler(console, 999)).toThrow('Invalid console handler stream');
});
