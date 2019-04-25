const Launcher = require('../../src/Launcher');
const ErrorHandlerFailed = require('../../src/ErrorHandlerFailed');
const Container = require('container').Container;
const RequestReceived = require('../../src/RequestReceived');
const MessageBus = require('message-bus').MessageBus;
const ViewRegistered = require('../../src/ViewRegistered');

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

beforeEach(() => {
    container.bind = jest.fn();
    container.make = ref => {
        switch (ref) {
            case MessageBus: return bus;
            case 'provider1': return provider1;
            case 'provider2': return provider2;
        }
        return null;
    };
    config.providers = ['provider1', 'provider2'];
    provider1.register = jest.fn();
    provider2.register = jest.fn();
    bus.send = jest.fn();

    launcher = new Launcher(container, config);

    parser.getArgument = arg => arg === Launcher.ARG_ARCHITECTURE ? architecture : file;
});

test('provides fqcn', () => {
    expect(Launcher.toString()).toBe('SlothMachine.SlothMachine.Launcher');
    expect(ErrorHandlerFailed.toString()).toBe('SlothMachine.SlothMachine.ErrorHandlerFailed');
    expect(RequestReceived.toString()).toBe('SlothMachine.SlothMachine.RequestReceived');
    expect(ViewRegistered.toString()).toBe('SlothMachine.SlothMachine.ViewRegistered');
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

test('sends message for requests', () => {
    const message = new RequestReceived('sloth_machine/run_program', Launcher.DEFAULT_REPRESENTATION, {
        architecture: architecture,
        file: file,
    });

    launcher.launch(parser);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(message);
});

test('handles parser errors', () => {
    const error = new Error();
    const message = new RequestReceived('sloth_machine_core/handle_error', 'error', {error: error});

    parser.getArgument = arg => {
        if (arg === Launcher.ARG_ARCHITECTURE) {
            throw error;
        }
    };

    launcher.launch(parser);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(message);
});

test('handles request errors', () => {
    const error = new Error();
    const message = new RequestReceived('sloth_machine_core/handle_error', 'error', {error: error});

    bus.send = jest.fn(message => {
        if (message.getEndpoint() === 'sloth_machine/run_program') {
            throw error;
        }
    });

    launcher.launch(parser);

    expect(bus.send.mock.calls[1][0]).toStrictEqual(message);
});

test('converts basic request errors into proper error objects', () => {
    const error = 'error';
    const message = new RequestReceived('sloth_machine_core/handle_error', 'error', {error: new Error(error)});

    bus.send = jest.fn(message => {
        if (message.getEndpoint() === 'sloth_machine/run_program') {
            throw error;
        }
    });

    launcher.launch(parser);

    expect(bus.send.mock.calls[1][0]).toStrictEqual(message);
});

test('sends errors happening in error handling as messages', () => {
    const error = new Error();

    bus.send = jest.fn(message => {
        if (message.constructor !== RequestReceived) {
            return;
        }
        if (message.getEndpoint() === 'sloth_machine/run_program') {
            throw new Error();
        }
        if (message.getEndpoint() === 'sloth_machine_core/handle_error') {
            throw error;
        }
    });

    launcher.launch(parser);

    expect(bus.send.mock.calls[2][0]).toStrictEqual(new ErrorHandlerFailed(error));
});

test('uses proper error object when sending error handler failures', () => {
    const error = 'error';

    bus.send = jest.fn(message => {
        if (message.constructor !== RequestReceived) {
            return;
        }
        if (message.getEndpoint() === 'sloth_machine/run_program') {
            throw new Error();
        }
        if (message.getEndpoint() === 'sloth_machine_core/handle_error') {
            throw error;
        }
    });

    launcher.launch(parser);

    expect(bus.send.mock.calls[2][0]).toStrictEqual(new ErrorHandlerFailed(new Error(error)));
});
