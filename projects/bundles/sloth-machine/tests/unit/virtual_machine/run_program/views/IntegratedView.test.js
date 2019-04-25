const IntegratedView = require('../../../../../src/virtual_machine/run_program/views/IntegratedView');
const View = require('../../../../../src/virtual_machine/run_program/presenters/console_presenter/View');
const ViewModel = require('../../../../../src/virtual_machine/run_program/presenters/console_presenter/ViewModel');
const Console = require('console-wrapper').Console;

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

test('provides fqcn', () => {
    expect(IntegratedView.toString()).toBe('SlothMachine.SlothMachine.VirtualMachine.RunProgram.Views.IntegratedView');
});

test('renders exit status', () => {
    const exitStatus = 100;
    const viewModel = new ViewModel(exitStatus);

    view.render(viewModel);

    expect(console.exit.mock.calls[0][0]).toBe(exitStatus);
});
