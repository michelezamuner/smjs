const Opcode = require('../../../src/interpreter/Opcode');
const Data = require('../../../src/data/Data');

test('provides fqcn', () => {
    expect(Opcode.toString()).toBe('SlothMachine.SlothMachineFramework.Interpreter.Opcode');
});

test('extends data', () => {
    expect(new Opcode()).toBeInstanceOf(Data);
});
