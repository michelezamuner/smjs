const Request = require('../../../../../src/core/handle_error/controller/Request');
const RequestInterface = require('app/core').handle_error.Request;

test('implements interface', () => {
    expect(new Request(new Error())).toBeInstanceOf(RequestInterface);
});

test('exposes properties', () => {
    const error = new Error();
    const request = new Request(error);

    expect(request.getError()).toBe(error);
});
