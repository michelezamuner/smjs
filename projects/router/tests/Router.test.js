const Router = require('../src/Router');
const Observer = require('../src/Observer');
const Input = require('../src/Input');
const RouterException = require('../src/RouterException');
const Container = require('container').Container;
const ContainerException = require('container').ContainerException;

/**
 * @type {Object|Container}
 */
const container = {};

/**
 * @type {Object|Observer}
 */
const observer = {};

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
const config = {};

/**
 * @type {string}
 */
const identifier = 'sloth_machine/run_program';

/**
 * @type {string}
 */
const representation = 'integrated';

/**
 * @type {string}
 */
const program = 'program/path';

/**
 * @type {string}
 */
const architecture = 'sma';

/**
 * @type {Input}
 */
const input = new Input(identifier, representation, {program: program, architecture: architecture});

beforeEach(() => {
    controller.runProgram = jest.fn();
    container.make = ref => ref === controllerClass ? controller : null;
    container.bind = jest.fn();
    observer.observe = jest.fn();
    config.routes = [
        {
            identifier: identifier,
            controller: controllerClass,
            action: 'runProgram(architecture, program)',
        },
    ];
    router = new Router(container, observer, config);
});

test('can be injected', () => {
    expect(Router.__DEPS__).toStrictEqual([ Container, Observer, 'router.config' ]);
});

test('routes given input to proper controller action and view', () => {
    router.route(input);

    expect(controller.runProgram.mock.calls[0][0]).toBe(architecture);
    expect(controller.runProgram.mock.calls[0][1]).toBe(program);
    expect(observer.observe.mock.calls[0][0]).toBe(input);
});

test('calls observer before making controller', () => {
    container.make = jest.fn();
    observer.observe = () => {
        throw new Error();
    };

    expect(() => router.route(input)).toThrow(Error);
    expect(container.make).not.toBeCalled();
});

test('fails if identifier is not configured', () => {
    const identifier = 'invalid';
    const input = new Input(identifier, representation, {program: program, architecture: architecture});

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(`Resource identifier "${identifier}" is not configured`);
});

test('fails if action is malformed', () => {
    const action = 'malformed';
    config.routes[0].action = action;

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(`Malformed action definition "${action}"`);
});

test('fails if controller does not support action', () => {
    const action = 'invalid';
    config.routes[0].action = `${action}()`;

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(`Action "${action}" not supported by controller`);
});

test('fails if required parameters are not passed to action', () => {
    const action = 'runProgram(other, params)';
    config.routes[0].action = action;

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(
        `Missing required "other" parameter of definition "${action}"`
    );
});


test('wraps container exceptions', () => {
    const error = 'error';

    container.make = () => {
        throw new ContainerException(error);
    };

    expect(() => router.route(input)).toThrow(RouterException);
    expect(() => router.route(input)).toThrow(error);
});

test('forwards generic exceptions', () => {
    const error = 'error';

    controller.runProgram = () => {
        throw new Error(error);
    };

    expect(() => router.route(input)).toThrow(Error);
    expect(() => router.route(input)).toThrow(error);
});
