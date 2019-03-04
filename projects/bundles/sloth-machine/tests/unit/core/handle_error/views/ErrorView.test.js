const View = require('../../../../../src/core/handle_error/views/ErrorView');
const ViewInterface = require('../../../../../src/core/handle_error/presenters/shared_presenter/View');
const ViewModel = require('../../../../../src/core/handle_error/presenters/shared_presenter/ViewModel');
const Console = require('lib/console').Console;

/**
 * @type {Console}
 */
const console = {};

/**
 * @type {null|View}
 */
let view = null;

beforeEach(() => {
    console.writeError = jest.fn();
    console.exit = jest.fn();
    view = new View(console);
});

test('implements view interface', () => {
    expect(view).toBeInstanceOf(ViewInterface);
});

test('can be injected', () => {
    expect(View.__DEPS__).toStrictEqual([Console]);
});

test('renders errors to STDOUT', () => {
    const error = 'error';

    view.render(new ViewModel(error));

    expect(console.writeError.mock.calls[0][0]).toBe(error);
    expect(console.exit.mock.calls[0][0]).toBe(View.ERROR_EXIT_STATUS);
});
