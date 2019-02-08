const ViewModel = require('../../../../../../src/adapters/sloth_machine/run_program/presenter/ViewModel');
const random = require('random');

test('contains exit status as number, and error as string', () => {
    const exitStatus = random(100);
    const error = 'error';
    const viewModel = new ViewModel(exitStatus, error);

    expect(viewModel.getExitStatus()).toBe(exitStatus);
    expect(viewModel.getError()).toBe(error);
});

test('fields can be null', () => {
    const viewModel = new ViewModel();

    expect(viewModel.getExitStatus()).toBe(null);
    expect(viewModel.getError()).toBe(null);
});
