const App = require('../../../src/app/App');
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

beforeEach(() => {
    router.route = jest.fn();
    app = new App(router);
    parser.getArgument = arg => arg === App.ARG_ARCHITECTURE ? architecture : file;
});

test('routes the correct input', () => {
    const input = new Input('sloth_machine/run_program', App.DEFAULT_REPRESENTATION, {
        architecture: architecture,
        file: file
    });

    app.run(parser);

    expect(router.route.mock.calls[0][0]).toStrictEqual(input);
});
