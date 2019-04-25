const Interpreter = require('../../../src/interpreter/Interpreter');
const InterpreterException = require('../../../src/interpreter/InterpreterException');

test('provides fqcn', () => {
    expect(Interpreter.toString()).toBe('SlothMachine.SlothMachineFramework.Interpreter.Interpreter');
    expect(InterpreterException.toString()).toBe('SlothMachine.SlothMachineFramework.Interpreter.InterpreterException');
});
