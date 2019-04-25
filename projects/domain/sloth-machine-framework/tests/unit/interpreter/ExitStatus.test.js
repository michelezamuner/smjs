const ExitStatus = require('../../../src/interpreter/ExitStatus');
const Integer = require('../../../src/data/Integer');

test('provides fqcn', () => {
    expect(ExitStatus.toString()).toBe('SlothMachine.SlothMachineFramework.Interpreter.ExitStatus');
});

test('is integer', () => {
    const exitStatus = new ExitStatus();

    expect(exitStatus).toBeInstanceOf(Integer);
});
