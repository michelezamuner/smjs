const Response = require('../../../../../src/application/virtual_machine/run_program/Response');
const ExitStatus = require('sloth-machine-framework').ExitStatus;

test('contains the exit status', () => {
    const exitStatus = new ExitStatus();
    const response = new Response(exitStatus);

    expect(response.getExitStatus()).toStrictEqual(exitStatus);
});
