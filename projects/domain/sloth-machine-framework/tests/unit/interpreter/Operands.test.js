const Operands = require('../../../src/interpreter/Operands');
const Data = require('../../../src/data/Data');

test('provides fqcn', () => {
    expect(Operands.toString()).toBe('SlothMachine.SlothMachineFramework.Interpreter.Operands');
});

test('extends data', () => {
    expect(new Operands()).toBeInstanceOf(Data);
});
