const Instruction = require('../../../src/interpreter/Instruction');
const DataUnit = require('../../../src/data/DataUnit');
const Address = require('../../../src/data/Address');
const Opcode = require('../../../src/interpreter/Opcode');
const Operands = require('../../../src/interpreter/Operands');
const random = require('lib/random');

test('provides fqcn', () => {
    expect(Instruction.toString()).toBe('SlothMachine.SlothMachineFramework.Interpreter.Instruction');
});

test('implements instruction details', () => {
    const address = new Address(random(100));
    const opcode = new Opcode([new DataUnit(random(100)), new DataUnit(random(100))]);
    const operands = new Operands([new DataUnit(random(100)), new DataUnit(random(100))]);
    const instruction = new Instruction(address, opcode, operands);

    expect(instruction.getAddress().eq(address)).toBe(true);
    expect(instruction.getOpcode().eq(opcode)).toBe(true);
    expect(instruction.getOperands().eq(operands)).toBe(true);
});
