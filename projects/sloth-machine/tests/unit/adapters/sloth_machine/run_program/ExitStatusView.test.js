const ExitStatusView = require('../../../../../src/adapters/sloth_machine/run_program/ExitStatusView');
const View = require('../../../../../src/adapters/sloth_machine/run_program/View');
const Console = require('../../../../../src/adapters/sloth_machine/run_program/Console');
const ViewModel = require('../../../../../src/adapters/sloth_machine/run_program/ViewModel');
const ExitStatus = require('sloth-machine-framework').ExitStatus;
const random = require('random');

/**
 * @type {Object|Console}
 */
const console = {};

/**
 * @type {null|ExitStatusView}
 */
let view = null;

beforeEach(() => {
    console.exit = jest.fn();
    view = new ExitStatusView(console);
});

test('implements view', () => {
    expect(view).toBeInstanceOf(View);
});

test('can be injected', () => {
    expect(ExitStatusView.__DEPS__).toStrictEqual([Console]);
});

test('renders given view model', () => {
    const value = random(100);
    const viewModel = new ViewModel(new ExitStatus(value));

    view.render(viewModel);

    expect(console.exit.mock.calls[0][0]).toStrictEqual('');
    expect(console.exit.mock.calls[0][1]).toStrictEqual(value);
});
