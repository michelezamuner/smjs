const ErrorResponse = require('../../../../../src/application/virtual_machine/run_program/ErrorResponse');

test('contains the error', () => {
    const error = new Error();
    const response = new ErrorResponse(error);

    expect(response.getError()).toStrictEqual(error);
});
