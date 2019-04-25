const Presenter = require('../../../../../../src/core/handle_error/presenters/console_presenter/Presenter');
const PresenterInterface = require('app/core').handle_error.Presenter;
const SharedPresenter = require('../../../../../../src/core/handle_error/presenters/shared_presenter/Presenter');
const SharedResponse = require('../../../../../../src/core/handle_error/presenters/shared_presenter/Response');
const Response = require('app/core').handle_error.Response;

/**
 * @type {SharedPresenter}
 */
const sharedPresenter = {};

/**
 * @type {null|Presenter}
 */
let presenter = null;

beforeEach(() => {
    sharedPresenter.present = jest.fn();
    presenter = new Presenter(sharedPresenter);
});

test('implements presenter interface', () => {
    expect(presenter).toBeInstanceOf(PresenterInterface);
});

test('can be injected', () => {
    expect(Presenter.__DEPS__).toStrictEqual([SharedPresenter]);
});

test('provides fqcn', () => {
    expect(Presenter.toString())
        .toBe('SlothMachine.SlothMachine.Core.HandleError.Presenters.ConsolePresenter.Presenter');
});

test('renders errors delegating to the shared presenter', () => {
    const error = new Error();
    const response = new Response(error);

    presenter.present(response);

    expect(sharedPresenter.present.mock.calls[0][0]).toStrictEqual(new SharedResponse(error));
});
