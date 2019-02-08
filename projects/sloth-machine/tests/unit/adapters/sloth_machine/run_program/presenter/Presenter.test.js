const Presenter = require('../../../../../../src/adapters/sloth_machine/run_program/presenter/Presenter');
const PresenterInterface = require('virtual-machine').Presenter;
const View = require('../../../../../../src/adapters/sloth_machine/run_program/presenter/View');
const SuccessResponse = require('virtual-machine').SuccessResponse;
const ErrorResponse = require('virtual-machine').ErrorResponse;
const MissingProgramReferenceException = require('virtual-machine').MissingProgramReferenceException;
const ExitStatus = require('sloth-machine-framework').ExitStatus;
const ViewModel = require('../../../../../../src/adapters/sloth_machine/run_program/presenter/ViewModel');
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;
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

test('handles success response', () => {
    const value = random(100);
    const response = new SuccessResponse(new ExitStatus(value));

    presenter.present(response);

    expect(view.render.mock.calls[0][0]).toStrictEqual(new ViewModel(value));
});

test('handles missing program reference exception', () => {
    const response = new ErrorResponse(new MissingProgramReferenceException());

    presenter.present(response);

    expect(view.render.mock.calls[0][0]).toStrictEqual(new ViewModel(null, 'No program file given'));
});

test('handles unsupported architecture exception', () => {
    const arc = 'architecture';
    const response = new ErrorResponse(new UnsupportedArchitectureException(arc));

    presenter.present(response);

    expect(view.render.mock.calls[0][0]).toStrictEqual(
        new ViewModel(null, `Cannot find selected architecture "${arc}"`)
    );
});

test('handles invalid architecture exception', () => {
    const arc = 'architecture';
    const response = new ErrorResponse(new InvalidArchitectureException(arc));

    presenter.present(response);

    expect(view.render.mock.calls[0][0]).toStrictEqual(
        new ViewModel(null, `Selected architecture "${arc}" has invalid implementation`)
    );
});

test('handles invalid program exception', () => {
    const message = 'error';
    const response = new ErrorResponse(new InvalidProgramException(message));

    presenter.present(response);

    expect(view.render.mock.calls[0][0]).toStrictEqual(
        new ViewModel(null, `Invalid program file given: ${message}`)
    );
});

test('handles generic exception', () => {
    const message = 'error';
    const response = new ErrorResponse(new Error(message));

    presenter.present(response);

    expect(view.render.mock.calls[0][0]).toStrictEqual(new ViewModel(null, message));
});
