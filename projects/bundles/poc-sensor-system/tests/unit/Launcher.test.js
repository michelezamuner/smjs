const Launcher = require('../../src/Launcher');
const Container = require('container').Container;
const Provider = require('../../config/Provider');
const SignalListener = require('../../src/adapters/sensor-system/sensor/send_signal/SignalListener');

/**
 * @type {Object|Container}
 */
const container = {};

/**
 * @type {null|Launcher}
 */
let launcher = null;

/**
 * @type {Object|Provider}
 */
const provider = {};

/**
 * @type {Object}
 */
const config = {};

/**
 * @type {Object|SignalListener}
 */
const listener = {};

/**
 * @type {string}
 */
const host = '127.0.0.1';

/**
 * @type {number}
 */
const port = 1234;

beforeEach(() => {
    provider.register = jest.fn();
    config.signal_listener = { host: host, port: port };
    container.bind = jest.fn();
    container.make = type => {
        switch (type) {
            case Provider: return provider;
            case SignalListener: return listener;
        }

        return null;
    };
    listener.listen = jest.fn();

    launcher = new Launcher(container, config);
});

test('registers provider', () => {
    launcher.launch();

    expect(container.bind.mock.calls[0][0]).toBe('config');
    expect(container.bind.mock.calls[0][1]).toBe(config);
    expect(provider.register).toBeCalled();
});

test('starts server', () => {
    launcher.launch();

    expect(listener.listen.mock.calls[0][0]).toBe(host);
    expect(listener.listen.mock.calls[0][1]).toBe(port);
});
