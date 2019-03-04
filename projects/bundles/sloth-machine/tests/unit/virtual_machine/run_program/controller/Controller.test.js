const Controller = require('../../../../../src/virtual_machine/run_program/controller/Controller');
const Request = require('../../../../../src/virtual_machine/run_program/controller/Request');
const RequestInterface = require('app/virtual-machine').run_program.Request;
const RunProgram = require('app/virtual-machine').run_program.RunProgram;

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
    const architectureName = 'architecture';
    const programFile = 'file';
    const request = new Request(architectureName, programFile);

    controller.runProgram(architectureName, programFile);

    expect(service.run.mock.calls[0][0]).toStrictEqual(request);
    expect(request).toBeInstanceOf(RequestInterface);
});

test('uses default architecture', () => {
    const programFile = 'file';
    const request = new Request(Controller.DEFAULT_ARCHITECTURE, programFile);

    controller.runProgram(null, programFile);

    expect(service.run.mock.calls[0][0]).toStrictEqual(request);
});
