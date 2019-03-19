const Request = require('../../../../../src/virtual_machine/run_program/controller/Request');
const RequestInterface = require('app/virtual-machine').run_program.Request;

test('implements interface', () => {
    expect(new Request('architecture', 'program')).toBeInstanceOf(RequestInterface);
});

test('exposes properties', () => {
    const architecture = 'architecture';
    const program = 'program';
    const request = new Request(architecture, program);

    expect(request.getArchitectureName()).toBe(architecture);
    expect(request.getProgramReference()).toBe(program);
});
