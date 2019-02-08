const Controller = require('../../../../../../src/adapters/sloth_machine/run_program/controller/Controller');
const Request = require('../../../../../../src/adapters/sloth_machine/run_program/controller/Request');
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
    const architectureName = 'architecture';
    const programFile = 'file';

    controller.runProgram(architectureName, programFile);

    expect(service.run.mock.calls[0][0]).toStrictEqual(new Request(architectureName, programFile));
});

test('uses default architecture', () => {
    const programFile = 'file';
    const request = new Request(Controller.DEFAULT_ARCHITECTURE, programFile);

    controller.runProgram(null, programFile);

    expect(service.run.mock.calls[0][0]).toStrictEqual(request);
});
