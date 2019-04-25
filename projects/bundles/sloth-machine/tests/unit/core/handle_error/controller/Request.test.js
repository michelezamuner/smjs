const Request = require('../../../../../src/core/handle_error/controller/Request');
const RequestInterface = require('app/core').handle_error.Request;

test('implements interface', () => {
    expect(new Request(new Error())).toBeInstanceOf(RequestInterface);
});

test('provides fqcn', () => {
    expect(Request.toString()).toBe('SlothMachine.SlothMachine.Core.HandleError.Controller.Request');
});

test('exposes properties', () => {
    const error = new Error();
    const request = new Request(error);

    expect(request.getError()).toBe(error);
});
