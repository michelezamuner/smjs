const ErrorView = require('../../../../../src/core/handle_error/views/ErrorView');
const ViewInterface = require('../../../../../src/core/handle_error/presenters/shared_presenter/View');
const ViewModel = require('../../../../../src/core/handle_error/presenters/shared_presenter/ViewModel');
const Console = require('console-wrapper').Console;

/**
 * @type {Console}
 */
const console = {};

/**
 * @type {null|ErrorView}
 */
let view = null;

beforeEach(() => {
    console.writeError = jest.fn();
    console.exit = jest.fn();
    view = new ErrorView(console);
});

test('implements view interface', () => {
    expect(view).toBeInstanceOf(ViewInterface);
});

test('can be injected', () => {
    expect(ErrorView.__DEPS__).toStrictEqual([Console]);
});

test('provides fqcn', () => {
    expect(ErrorView.toString()).toBe('SlothMachine.SlothMachine.Core.HandleError.Views.ErrorView');
});

test('renders errors to STDOUT', () => {
    const error = 'error';

    view.render(new ViewModel(error));

    expect(console.writeError.mock.calls[0][0]).toBe(error);
    expect(console.exit.mock.calls[0][0]).toBe(ViewInterface.ERROR_EXIT_STATUS);
});
