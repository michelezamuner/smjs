const Launcher = require('../../src/Launcher');
const ErrorHandlerFailed = require('../../src/ErrorHandlerFailed');
const Container = require('container').Container;
const Router = require('router').Router;
const MessageBus = require('message-bus').MessageBus;
const Input = require('router').Input;

/**
 * @type {Object|Container}
 */
const container = {};

/**
 * @type {null|Launcher}
 */
let launcher = null;

/**
 * @type {Object}
 */
const parser = {};

/**
 * @type {Object}
 */
const config = {};

/**
 * @type {Object}
 */
const provider1 = {};

/**
 * @type {Object}
 */
const provider2 = {};

/**
 * @type {Object|Router}
 */
const router = {};

/**
 * @type {string}
 */
const architecture = 'architecture';

/**
 * @type {string}
 */
const file = 'file';

/**
 * @type {Object}
 */
const bus = {};

/**
 * @type {Input}
 */
const input = new Input('sloth_machine/run_program', Launcher.DEFAULT_REPRESENTATION, {
    architecture: architecture,
    file: file
});

beforeEach(() => {
    container.bind = jest.fn();
    container.make = ref => {
        switch (ref) {
            case Router: return router;
            case MessageBus: return bus;
            case 'provider1': return provider1;
            case 'provider2': return provider2;
        }
        return null;
    };
    config.providers = ['provider1', 'provider2'];
    provider1.register = jest.fn();
    provider2.register = jest.fn();
    router.route = jest.fn();
    bus.send = jest.fn();

    launcher = new Launcher(container, config);

    parser.getArgument = arg => arg === Launcher.ARG_ARCHITECTURE ? architecture : file;
});

test('registers config', () => {
    launcher.launch(parser);

    expect(container.bind.mock.calls[0][0]).toBe('config');
    expect(container.bind.mock.calls[0][1]).toBe(config);
});

test('register providers', () => {
    launcher.launch(parser);

    expect(provider1.register).toBeCalled();
    expect(provider2.register).toBeCalled();
});

test('routes the correct input', () => {
    launcher.launch(parser);

    expect(router.route.mock.calls[0][0]).toStrictEqual(input);
});

test('handles parser errors', () => {
    const error = new Error();
    const errorInput = new Input('console_application/handle_error', 'error', {error: error});

    parser.getArgument = arg => {
        if (arg === Launcher.ARG_ARCHITECTURE) {
            throw error;
        }
    };

    launcher.launch(parser);

    expect(router.route.mock.calls[0][0]).toStrictEqual(errorInput);
});

test('handles router errors', () => {
    const error = new Error();
    const errorInput = new Input('console_application/handle_error', 'error', {error: error});

    router.route = jest.fn(arg => {
        if (arg.getIdentifier() === input.getIdentifier()) {
            throw error;
        }
    });

    launcher.launch(parser);

    expect(router.route.mock.calls[1][0]).toStrictEqual(errorInput);
});

test('converts basic router errors into proper error objects', () => {
    const error = 'error';
    const errorInput = new Input('console_application/handle_error', 'error', {error: new Error(error)});

    router.route = jest.fn(arg => {
        if (arg.getIdentifier() === input.getIdentifier()) {
            throw error;
        }
    });

    launcher.launch(parser);

    expect(router.route.mock.calls[1][0]).toStrictEqual(errorInput);
});

test('sends errors happening in error routing as messages', () => {
    const error = new Error();

    router.route = arg => {
        if (arg.getIdentifier() === input.getIdentifier()) {
            throw new Error();
        }
        if (arg.getIdentifier() === 'console_application/handle_error') {
            throw error;
        }
    };

    launcher.launch(parser);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(new ErrorHandlerFailed(error));
});

test('uses proper error object when sending error handler failures', () => {
    const error = 'error';

    router.route = arg => {
        if (arg.getIdentifier() === input.getIdentifier()) {
            throw new Error();
        }
        if (arg.getIdentifier() === 'console_application/handle_error') {
            throw error;
        }
    };

    launcher.launch(parser);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(new ErrorHandlerFailed(new Error(error)));
});
