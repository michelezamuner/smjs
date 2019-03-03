const FileHandler = require('../../src/handlers/FileHandler');
const Handler = require('../../src/Handler');
const FileHandlerWriter = require('../../src/handlers/FileHandlerWriter');

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

test('uses default writer', () => {
    const handler = new FileHandler(file);

});

test('appends to given file', () => {
    const message = 'message';

    handler.handle(message);

    expect(writer.write.mock.calls[0][0]).toBe(file);
    expect(writer.write.mock.calls[0][1]).toBe(message + '\n');
    expect(writer.write.mock.calls[0][2]).toStrictEqual({encoding: 'utf8', flag: 'as'});
});
