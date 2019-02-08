const Request = require('../../../../../../src/adapters/sloth_machine/run_program/controller/Request');
const RequestInterface = require('virtual-machine').Request;

/**
 * @type {null|Request}
 */
let request = null;

/**
 * @type {string}
 */
const architectureName = 'architecture';

/**
 * @type {string}
 */
const programReference = 'program';

beforeEach(() => {
    request = new Request(architectureName, programReference);
});

test('implements application interface', () => {
    expect(request).toBeInstanceOf(RequestInterface);
});

test('contains request parameters', () => {
    expect(request.getArchitectureName()).toBe(architectureName);
    expect(request.getProgramReference()).toBe(programReference);
});
