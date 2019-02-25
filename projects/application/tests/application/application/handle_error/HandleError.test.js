const HandleError = require('../../../../src/application/application/handle_error/HandleError');
const Presenter = require('../../../../src/application/application/handle_error/Presenter');
const Request = require('../../../../src/application/application/handle_error/Request');
const Response = require('../../../../src/application/application/handle_error/Response');

/**
 * @type {Presenter}
 */
const presenter = {};

/**
 * @type {null|HandleError}
 */
let service = null;

/**
 * @type {Request}
 */
const request = {};

beforeEach(() => {
    presenter.present = jest.fn();
    service = new HandleError(presenter);
});

test('can be injected', () => {
    expect(HandleError.__DEPS__).toStrictEqual([ Presenter ]);
});

test('uses given presenter to present given errors', () => {
    const error = new Error();
    request.getError = () => error;

    service.handle(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(error));
});
