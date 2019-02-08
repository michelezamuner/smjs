const SuccessResponse = require('../../../../../src/application/virtual_machine/run_program/SuccessResponse');
const ExitStatus = require('sloth-machine-framework').ExitStatus;

test('contains the exit status', () => {
    const exitStatus = new ExitStatus();
    const response = new SuccessResponse(exitStatus);

    expect(response.getExitStatus()).toStrictEqual(exitStatus);
});
