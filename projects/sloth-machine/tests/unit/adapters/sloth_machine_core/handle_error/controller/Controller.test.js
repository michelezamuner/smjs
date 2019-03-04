const Controller = require('../../../../../../src/adapters/sloth_machine_core/handle_error/controller/Controller');
const Request = require('../../../../../../src/adapters/sloth_machine_core/handle_error/controller/Request');
const RequestInterface = require('app/core').handle_error.Request;
const HandleError = require('app/core').handle_error.HandleError;

/**
 * @type {Object|HandleError}
 */
const service = {};

/**
 * @type {null|Controller}
 */
let controller = null;

beforeEach(() => {
    service.handle = jest.fn();
    controller = new Controller(service);
});

test('can be injected', () => {
    expect(Controller.__DEPS__).toStrictEqual([ HandleError ]);
});

test('calls service with proper request', () => {
    const error = new Error();
    const request = new Request(error);

    controller.handleError(error);

    expect(service.handle.mock.calls[0][0]).toStrictEqual(request);
    expect(request).toBeInstanceOf(RequestInterface);
});