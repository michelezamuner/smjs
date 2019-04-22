const SignalListener = require('../../../../../../src/adapters/sensor-system/sensor/send_signal/SignalListener');
const NativeServer = require('../../../../../../src/adapters/sensor-system/sensor/send_signal/NativeServer');

/**
 * @type {Object|NativeServer}
 */
const server = {};

/**
 * @type {null|SignalListener}
 */
let listener = null;

/**
 * @type {string}
 */
const host = '127.0.0.1';

/**
 * @type {number}
 */
const port = 1234;

beforeEach(() => {
    server.listen = jest.fn();
    listener = new SignalListener(server);
});

test('can be injected', () => {
    expect(SignalListener.__DEPS__).toStrictEqual([ NativeServer ]);
});

test('listens to connections with given handler', () => {
    listener.listen(host, port);

    expect(server.listen.mock.calls[0][0]).toBe(port);
    expect(server.listen.mock.calls[0][1]).toBe(host);
});
