const Presenter = require('../../../../../../../src/adapters/sloth_machine/run_program/presenters/ConsolePresenter/Presenter');
const View = require('../../../../../../../src/adapters/sloth_machine/run_program/presenters/ConsolePresenter/View');
const ViewModel = require('../../../../../../../src/adapters/sloth_machine/run_program/presenters/ConsolePresenter/ViewModel');
const ErrorView = require('../../../../../../../src/adapters/sloth_machine/run_program/presenters/ConsolePresenter/ErrorView');
const ErrorViewModel = require('../../../../../../../src/adapters/sloth_machine/run_program/presenters/ConsolePresenter/ErrorViewModel');
const PresenterInterface = require('virtual-machine').Presenter;
const Response = require('virtual-machine').Response;
const ExitStatus = require('sloth-machine-framework').ExitStatus;
const MissingProgramReferenceException = require('virtual-machine').MissingProgramReferenceException;
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;
const random = require('random');

/**
 * @type {Object|View}
 */
const view = {};

/**
 * @type {Object|ErrorView}
 */
const errorView = {};

/**
 * @type {null|Presenter}
 */
let presenter = null;

beforeEach(() => {
    view.render = jest.fn();
    errorView.render = jest.fn();
    presenter = new Presenter(view, errorView);
});

test('implements presenter interface', () => {
    expect(presenter).toBeInstanceOf(PresenterInterface);
});

test('can be injected', () => {
    expect(Presenter.__DEPS__).toStrictEqual([View, ErrorView]);
});

test('handles success response', () => {
    const value = random(255);
    const response = new Response(new ExitStatus(value));

    presenter.present(response);

    expect(view.render.mock.calls[0][0]).toStrictEqual(new ViewModel(value));
});

test('normalizes too big exit status to POSIX compliant default', () => {
    const value = 300; // Greater than POSIX max 255
    const response = new Response(new ExitStatus(value));

    presenter.present(response);
    expect(view.render.mock.calls[0][0]).toStrictEqual(new ViewModel(Presenter.DEFAULT_EXIT_STATUS));
});

test('normalizes negative exit status to POSIX compliant default', () => {
    const value = -123; // Smaller than POSIX min 0
    const response = new Response(new ExitStatus(value));

    presenter.present(response);
    expect(view.render.mock.calls[0][0]).toStrictEqual(new ViewModel(Presenter.DEFAULT_EXIT_STATUS));
});

test('handles missing program reference exception', () => {
    const response = new Response(null, new MissingProgramReferenceException());

    presenter.present(response);

    expect(errorView.render.mock.calls[0][0]).toStrictEqual(new ErrorViewModel('No program file given'));
});

test('handles unsupported architecture exception', () => {
    const arc = 'architecture';
    const response = new Response(null, new UnsupportedArchitectureException(arc));

    presenter.present(response);

    expect(errorView.render.mock.calls[0][0]).toStrictEqual(
        new ErrorViewModel(`Cannot find selected architecture "${arc}"`)
    );
});

test('handles invalid architecture exception', () => {
    const arc = 'architecture';
    const response = new Response(null, new InvalidArchitectureException(arc));

    presenter.present(response);

    expect(errorView.render.mock.calls[0][0]).toStrictEqual(
        new ErrorViewModel(`Selected architecture "${arc}" has invalid implementation`)
    );
});

test('handles invalid program exception', () => {
    const message = 'error';
    const response = new Response(null, new InvalidProgramException(message));

    presenter.present(response);

    expect(errorView.render.mock.calls[0][0]).toStrictEqual(
        new ErrorViewModel(`Invalid program file given: ${message}`)
    );
});

test('handles generic exception', () => {
    const message = 'error';
    const response = new Response(null, new Error(message));

    presenter.present(response);

    expect(errorView.render.mock.calls[0][0]).toStrictEqual(new ErrorViewModel(message));
});
