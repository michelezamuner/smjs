const App = require('../../../src/app/App');
const Router = require('router').Router;
const Input = require('router').Input;

/**
 * @type {Object}
 */
const router = {};

/**
 * @type {null|App}
 */
let app = null;

/**
 * @type {Object}
 */
const parser = {};

/**
 * @type {string}
 */
const architecture = 'architecture';

/**
 * @type {string}
 */
const file = 'file';

/**
 * @type {Input}
 */
const input = new Input('sloth_machine/run_program', App.DEFAULT_REPRESENTATION, {
    architecture: architecture,
    file: file
});

beforeEach(() => {
    router.route = jest.fn();
    app = new App(router);
    parser.getArgument = arg => arg === App.ARG_ARCHITECTURE ? architecture : file;
});

test('can be injected', () => {
    expect(App.__DEPS__).toStrictEqual([ Router ]);
});

test('routes the correct input', () => {
    app.run(parser);

    expect(router.route.mock.calls[0][0]).toStrictEqual(input);
});

test('handles system errors', () => {
    const error = 'error';
    const message = `Fatal error: ${error}`;
    const errorInput = new Input('console_application/handle_error', 'error', {error: new Error(message)});

    router.route = jest.fn(arg => {
        if (arg.getIdentifier() === input.getIdentifier()) {
            throw new Error(error);
        }
    });

    app.run(parser);

    expect(router.route.mock.calls[1][0]).toStrictEqual(errorInput);
});

test('forwards errors happening in error routing', () => {
    const error = 'error';

    router.route = arg => {
        if (arg.getIdentifier() === input.getIdentifier()) {
            throw new Error();
        }
        if (arg.getIdentifier() === 'console_application/handle_error') {
            throw new Error(error);
        }
    };

    expect(() => app.run(parser)).toThrow(Error);
    expect(() => app.run(parser)).toThrow(error);
});
