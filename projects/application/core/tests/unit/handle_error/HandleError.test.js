const HandleError = require('../../../src/handle_error/HandleError');
const Presenter = require('../../../src/handle_error/Presenter');
const Notifier = require('app/notifications').Notifier;
const Request = require('../../../src/handle_error/Request');
const Response = require('../../../src/handle_error/Response');
const ErrorReceived = require('../../../src/handle_error/messages/ErrorReceived');

/**
 * @type {Object|Presenter}
 */
const presenter = {};

/**
 * @type {Object|Notifier}
 */
const notifier = {};

/**
 * @type {null|HandleError}
 */
let service = null;

/**
 * @type {Request}
 */
const request = {};

/**
 * @type {null|boolean}
 */
let presenterCalled = null;

beforeEach(() => {
    presenterCalled = false;
    presenter.present = jest.fn(() => presenterCalled = true);
    notifier.notify = jest.fn(() => expect(presenterCalled).toBe(false));
    service = new HandleError(presenter, notifier);
});

test('can be injected', () => {
    expect(HandleError.__DEPS__).toStrictEqual([ Presenter, Notifier ]);
});

test('provides fqcn', () => {
    expect(HandleError.toString()).toBe('SlothMachine.Core.HandleError.HandleError');
    expect(Presenter.toString()).toBe('SlothMachine.Core.HandleError.Presenter');
    expect(Request.toString()).toBe('SlothMachine.Core.HandleError.Request');
    expect(Response.toString()).toBe('SlothMachine.Core.HandleError.Response');
    expect(ErrorReceived.toString()).toBe('SlothMachine.Core.HandleError.Messages.ErrorReceived');
});

test('uses given presenter to present given errors', () => {
    const error = new Error();
    request.getError = () => error;

    service.handle(request);

    expect(notifier.notify.mock.calls[0][0]).toStrictEqual(new ErrorReceived(error));
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(
        new Response(new Error('A fatal error happened in the application')));
});

