const Presenter = require('../../../../../../src/core/handle_error/presenters/shared_presenter/Presenter');
const View = require('../../../../../../src/core/handle_error/presenters/shared_presenter/View');
const Response = require('../../../../../../src/core/handle_error/presenters/shared_presenter/Response');
const ViewModel = require('../../../../../../src/core/handle_error/presenters/shared_presenter/ViewModel');

/**
 * @type {View}
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

test('can be injected', () => {
    expect(Presenter.__DEPS__).toStrictEqual([View]);
});

test('provides fqcn', () => {
    expect(Presenter.toString())
        .toBe('SlothMachine.SlothMachine.Core.HandleError.Presenters.SharedPresenter.Presenter');
    expect(Response.toString()).toBe('SlothMachine.SlothMachine.Core.HandleError.Presenters.SharedPresenter.Response');
    expect(View.toString()).toBe('SlothMachine.SlothMachine.Core.HandleError.Presenters.SharedPresenter.View');
    expect(ViewModel.toString())
        .toBe('SlothMachine.SlothMachine.Core.HandleError.Presenters.SharedPresenter.ViewModel');
});

test('renders given error', () => {
    const message = 'error message';
    const response = new Response(new Error(message));

    presenter.present(response);

    expect(view.render.mock.calls[0][0]).toStrictEqual(new ViewModel(message));
});
