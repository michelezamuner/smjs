const IntegratedView = require('../../../../../../src/adapters/sloth_machine/run_program/views/IntegratedView');
const View = require('../../../../../../src/adapters/sloth_machine/run_program/presenters/ConsolePresenter/View');
const ViewModel = require('../../../../../../src/adapters/sloth_machine/run_program/presenters/ConsolePresenter/ViewModel');
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
