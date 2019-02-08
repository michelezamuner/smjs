const IntegratedView = require('../../../../../../src/adapters/sloth_machine/run_program/views/IntegratedView');
const View = require('../../../../../../src/adapters/sloth_machine/run_program/presenter/View');
const ViewModel = require('../../../../../../src/adapters/sloth_machine/run_program/presenter/ViewModel');
const Console = require('../../../../../../src/adapters/sloth_machine/run_program/views/Console');

/**
 * @type {Object|Console}
 */
const console = {};

/**
 * @type {null|IntegratedView}
 */
let view = null;

beforeEach(() => {
    console.write = jest.fn();
    console.exit = jest.fn();
    view = new IntegratedView(console);
});

test('implements view', () => {
    expect(view).toBeInstanceOf(View);
});

test('can be injected', () => {
    expect(IntegratedView.__DEPS__).toStrictEqual([Console]);
});

test('renders exit status', () => {
    const exitStatus = 100;
    const viewModel = new ViewModel(exitStatus);

    view.render(viewModel);

    expect(console.exit.mock.calls[0][0]).toBe(exitStatus);
});

test('renders error', () => {
    const error = 'error';
    const viewModel = new ViewModel(null, error);

    view.render(viewModel);

    expect(console.write.mock.calls[0][0]).toBe(error);
    expect(console.write.mock.calls[0][1]).toBe(Console.STREAM_STDERR);
    expect(console.exit.mock.calls[0][0]).toBe(View.ERROR_EXIT_STATUS);
});
