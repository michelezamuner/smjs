const ViewModel = require('../../../../../src/adapters/sloth_machine/run_program/ViewModel');
const ExitStatus = require('sloth-machine-framework').ExitStatus;
const random = require('random');

test('converts the exit status into native integer', () => {
    const value = random(100);
    const viewModel = new ViewModel(new ExitStatus(value));
    expect(viewModel.getExitStatus()).toBe(value);
});
