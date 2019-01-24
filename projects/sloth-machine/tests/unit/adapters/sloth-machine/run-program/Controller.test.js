const Controller = require('../../../../../src/adapters/sloth-machine/run_program/Controller');
const Request = require('../../../../../src/adapters/sloth-machine/run_program/Request');
const RunProgram = require('virtual-machine').RunProgram;

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

test('can be injected', () => {
    expect(Controller.__DEPS__).toStrictEqual([ RunProgram ]);
});

test('calls service with proper request', () => {
    const request = new Request('architecture');
    controller.runProgram(request);

    expect(service.run.mock.calls[0][0]).toStrictEqual(request);
});
