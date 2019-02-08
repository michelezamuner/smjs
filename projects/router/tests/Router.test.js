const Router = require('../src/Router');
const Input = require('../src/Input');
const RouterException = require('../src/RouterException');
const ModuleLoaderException = require('../src/ModuleLoaderException');
const ContainerException = require('container').ContainerException;

/**
 * @type {Object}
 */
const container = {};

/**
 * @type {Object}
 */
const loader = {};

/**
 * @type {null|Router}
 */
let router = null;

/**
 * @type {Object}
 */
const controllerClass = {};

/**
 * @type {Object}
 */
const controller = {};

/**
 * @type {Object}
 */
const viewInterface = {};

/**
 * @type {Object}
 */
const viewClass = {};

/**
 * @type {Object}
 */
const config = {};

/**
 * @type {Input}
 */
const input = new Input('sloth_machine/run_program', 'integrated', {program: 'program/path', architecture: 'sma'});

beforeEach(() => {
    loader.load = path => {
        switch (path) {
            case 'sloth_machine/run_program/Controller': return controllerClass;
            case 'sloth_machine/run_program/views/IntegratedView': return viewClass;
            case 'sloth_machine/run_program/views/View': return viewInterface;
        }

        return null;
    };
    controller.runProgram = jest.fn();
    container.make = ref => ref === controllerClass ? controller : null;
    container.bind = jest.fn();
    config['sloth_machine/run_program'] = {
        controller: 'sloth_machine/run_program/Controller',
        action: 'runProgram(architecture, program)',
        viewInterface: 'sloth_machine/run_program/views/View',
        views: {
            integrated: 'sloth_machine/run_program/views/IntegratedView',
            clean: 'sloth_machine/run_program/views/CleanView',
            verbose: 'sloth_machine/run_program/views/VerboseView'
        }
    };
    router = new Router(container, loader, config);
});

test('routes given input to proper controller action and view', () => {
    router.route(input);

    expect(controller.runProgram.mock.calls[0][0]).toBe('sma');
    expect(controller.runProgram.mock.calls[0][1]).toBe('program/path');
    expect(container.bind.mock.calls[0][0]).toBe(viewInterface);
    expect(container.bind.mock.calls[0][1]).toBe(viewClass);
});

test('fails if identifier is not configured', () => {
    const identifier = 'invalid';
    const input = new Input(identifier, 'integrated', {program: 'program/path', architecture: 'sma'});

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(`Resource identifier "${identifier}" is not configured`);
});

test('fails if controller does not support action', () => {
    const action = 'invalid';
    config['sloth_machine/run_program'].action = action;

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(`Action "${action}" not supported by controller`);
});

test('fails if required parameters are not passed to action', () => {
    config['sloth_machine/run_program'].action = 'runProgram(other, params)';

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(
        `Missing required "other" parameter of definition "runProgram(other, params)"`
    );
});

test('wraps loader exceptions', () => {
    const error = 'error';

    loader.load = () => {
        throw new ModuleLoaderException(error);
    };

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(error);
});

test('wraps container exceptions', () => {
    const error = 'error';

    container.make = () => {
        throw new ContainerException(error);
    };

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(error);
});

test('wraps generic exceptions', () => {
    const error = 'error';

    controller.runProgram = () => {
        throw error;
    };

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(error);
});
