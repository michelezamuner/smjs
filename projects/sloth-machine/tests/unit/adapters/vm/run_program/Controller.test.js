const Controller = require('../../../../../src/adapters/cli/vm/run_program/Controller');
const RunProgram = require('core').RunProgram;
const Request = require('../../../../../src/adapters/cli/vm/run_program/Request');

/**
 * @type {Object|RunProgram}
 */
const service = {};

/**
 * @type {null|Controller}
 */
let controller = null;

beforeEach(() => {
    service.run = jest.fn();
    controller = new Controller(service);
});

test('calls service with proper request', () => {
    const request = new Request('architecture');
    controller.runProgram(request);

    expect(service.run.mock.calls[0][0]).toStrictEqual(request);
});
