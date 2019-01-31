const Presenter = require('../../../../../src/adapters/sloth_machine/run_program/Presenter');
const PresenterInterface = require('virtual-machine').Presenter;
const View = require('../../../../../src/adapters/sloth_machine/run_program/View');
const Response = require('virtual-machine').Response;
const ExitStatus = require('sloth-machine-framework').ExitStatus;
const ViewModel = require('../../../../../src/adapters/sloth_machine/run_program/ViewModel');
const random = require('random');

/**
 * @type {Object|View}
 */
const view = {};

/**
 * @type {null|Presenter}
 */
let presenter = null;

beforeEach(() => {
    view.render = jest.fn();
    presenter = new Presenter(view);
});

test('implements presenter interface', () => {
    expect(presenter).toBeInstanceOf(PresenterInterface);
});

test('can be injected', () => {
    expect(Presenter.__DEPS__).toStrictEqual([View]);
});

test('renders response', () => {
    const value = random(100);
    const response = new Response(new ExitStatus(value));

    presenter.present(response);

    expect(view.render.mock.calls[0][0]).toStrictEqual(new ViewModel(new ExitStatus(value)));
});
