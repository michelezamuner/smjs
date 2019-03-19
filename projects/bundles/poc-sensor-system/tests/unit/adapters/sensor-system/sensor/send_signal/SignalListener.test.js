const SignalListener = require('../../../../../../src/adapters/sensor-system/sensor/send_signal/SignalListener');
const ServerBuilder = require('../../../../../../src/adapters/sensor-system/sensor/send_signal/ServerBuilder');
const SignalHandler = require('../../../../../../src/adapters/sensor-system/sensor/send_signal/SignalHandler');
const Server = require('net').Server;

/**
 * @type {Object|ServerBuilder}
 */
const builder = {};

/**
 * @type {Object|SignalHandler}
 */
const handler = {};

/**
 * @type {null|SignalListener}
 */
let listener = null;

/**
 * @type {Object|Server}
 */
const server = {};

/**
 * @type {string}
 */
const host = '127.0.0.1';

/**
 * @type {number}
 */
const port = 1234;

beforeEach(() => {
    handler.handleData = () => {};
    builder.build = callback => callback === handler.handleData ? server : null;
    server.listen = jest.fn();
    listener = new SignalListener(builder, handler);
});

test('can be injected', () => {
    expect(SignalListener.__DEPS__).toStrictEqual([ ServerBuilder, SignalHandler ]);
});

test('listens to connections with given handler', () => {
    listener.listen(host, port);

    expect(server.listen.mock.calls[0][0]).toBe(port);
    expect(server.listen.mock.calls[0][1]).toBe(host);
});
