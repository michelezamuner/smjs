const FileHandler = require('../../src/handlers/FileHandler');
const Handler = require('../../src/Handler');
const FileHandlerWriter = require('../../src/handlers/FileHandlerWriter');
const FileHandlerNativeWriter = require('../../src/handlers/FileHandlerNativeWriter');

/**
 * @type {Object|FileHandlerWriter}
 */
const writer = {};

/**
 * @type {string}
 */
const file = 'file';

/**
 * @type {null|FileHandler}
 */
let handler = null;

beforeEach(() => {
    writer.write = jest.fn();
    handler = new FileHandler(file, writer);
});

test('implements interface', () => {
    expect(handler).toBeInstanceOf(Handler);
});

test('provides fqcn', () => {
    expect(FileHandler.toString()).toBe('Logger.Handlers.FileHandler');
    expect(FileHandlerWriter.toString()).toBe('Logger.Handlers.FileHandlerWriter');
    expect(FileHandlerNativeWriter.toString()).toBe('Logger.Handlers.FileHandlerNativeWriter');
});

test('uses default writer', () => {
    const handler = new FileHandler('/tmp/file');

    let thrown = false;
    try {
        handler.handle('message');
    } catch (e) {
        thrown = true;
    }

    expect(thrown).toBe(false);
});

test('appends to given file', () => {
    const message = 'message';

    handler.handle(message);

    expect(writer.write.mock.calls[0][0]).toBe(file);
    expect(writer.write.mock.calls[0][1]).toBe(message + '\n');
    expect(writer.write.mock.calls[0][2]).toStrictEqual({encoding: 'utf8', flag: 'as'});
});
