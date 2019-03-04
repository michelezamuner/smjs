const Presenter = require('../../../../../../../src/adapters/sloth_machine/run_program/presenters/console_presenter/Presenter');
const View = require('../../../../../../../src/adapters/sloth_machine/run_program/presenters/console_presenter/View');
const ViewModel = require('../../../../../../../src/adapters/sloth_machine/run_program/presenters/console_presenter/ViewModel');
const ErrorPresenter = require('../../../../../../../src/adapters/console_application/handle_error/presenters/shared_presenter/Presenter');
const ErrorResponse = require('../../../../../../../src/adapters/console_application/handle_error/presenters/shared_presenter/Response');
const PresenterInterface = require('virtual-machine').Presenter;
const Response = require('virtual-machine').Response;
const ExitStatus = require('domain/sloth-machine-framework').interpreter.ExitStatus;
const MissingProgramReferenceException = require('virtual-machine').MissingProgramReferenceException;
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;
const random = require('lib/random');

/**
 * @type {View}
 */
const view = {};

/**
 * @type {ErrorPresenter}
 */
const errorPresenter = {};

/**
 * @type {null|Presenter}
 */
let presenter = null;

beforeEach(() => {
    view.render = jest.fn();
    errorPresenter.present = jest.fn();
    presenter = new Presenter(view, errorPresenter);
});

test('implements presenter interface', () => {
    expect(presenter).toBeInstanceOf(PresenterInterface);
});

test('can be injected', () => {
    expect(Presenter.__DEPS__).toStrictEqual([View, ErrorPresenter]);
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

    expect(errorPresenter.present.mock.calls[0][0])
        .toStrictEqual(new ErrorResponse(new Error('No program file given')));
});

test('handles unsupported architecture exception', () => {
    const arc = 'architecture';
    const response = new Response(null, new UnsupportedArchitectureException(arc));

    presenter.present(response);

    expect(errorPresenter.present.mock.calls[0][0])
        .toStrictEqual(new ErrorResponse(new Error(`Cannot find selected architecture "${arc}"`)));
});

test('handles invalid architecture exception', () => {
    const arc = 'architecture';
    const response = new Response(null, new InvalidArchitectureException(arc));

    presenter.present(response);

    expect(errorPresenter.present.mock.calls[0][0])
        .toStrictEqual(new ErrorResponse(new Error(`Selected architecture "${arc}" has invalid implementation`)));
});

test('handles invalid program exception', () => {
    const message = 'error';
    const response = new Response(null, new InvalidProgramException(message));

    presenter.present(response);

    expect(errorPresenter.present.mock.calls[0][0])
        .toStrictEqual(new ErrorResponse(new Error(`Invalid program file given: ${message}`)));
});

test('handles generic exception', () => {
    const error = new Error();
    const response = new Response(null, error);

    presenter.present(response);

    expect(errorPresenter.present.mock.calls[0][0])
        .toStrictEqual(new ErrorResponse(error));
});
