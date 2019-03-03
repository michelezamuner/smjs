const HandleError = require('../../../../src/application/application/handle_error/HandleError');
const Presenter = require('../../../../src/application/application/handle_error/Presenter');
const MessageBus = require('message-bus').MessageBus;
const Request = require('../../../../src/application/application/handle_error/Request');
const Response = require('../../../../src/application/application/handle_error/Response');
const ErrorReceived = require('../../../../src/application/application/handle_error/messages/ErrorReceived');

/**
 * @type {Object|Presenter}
 */
const presenter = {};

/**
 * @type {Object|MessageBus}
 */
const bus = {};

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
    bus.send = jest.fn(() => expect(presenterCalled).toBe(false));
    service = new HandleError(presenter, bus);
});

test('can be injected', () => {
    expect(HandleError.__DEPS__).toStrictEqual([ Presenter, MessageBus ]);
});

test('uses given presenter to present given errors', () => {
    const error = new Error();
    request.getError = () => error;

    service.handle(request);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(new ErrorReceived(error));
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(
        new Response(new Error('A fatal error happened in the application')));
});

