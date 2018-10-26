const Interpreter = require('../../../../src/Architectures/SMA/Interpreter');
const InterpreterInterface = require('../../../../src/ProcessorInterfaces/Interpreter');
const Byte = require('../../../../src/DataTypes/Byte');
const Double = require('../../../../src/DataTypes/Double');
const random = require('../../random');

/**
 * @type {object}
 */
const instructionSet = {};

/**
 * @type {object}
 */
const opcodeMap = {};

/**
 * @type {null|Interpreter}
 */
let interpreter = null;

beforeEach(() => {
    interpreter = new Interpreter(instructionSet, opcodeMap);
});

test('implements interpreter interface', () => {
    expect(interpreter instanceof InterpreterInterface).toBe(true);
});

test('provides instructions size', () => {
    expect(interpreter.getInstructionSize()).toStrictEqual(new Byte(4));
});

test('executes the correct instruction', () => {
    const [byte1, byte2, byte3, byte4] = (new Double(random(Double))).expand();
    const instruction = {
        exec: jest.fn(),
    };
    const opcode = 'opcode';
    const definition = 'Opcode';

    opcodeMap[opcode] = new Byte(byte1);
    instructionSet.get = opc => opc === definition ? instruction : null;

    interpreter.exec([byte1, byte2, byte3, byte4]);

    expect(instruction.exec.mock.calls[0][0]).toBe(byte2);
    expect(instruction.exec.mock.calls[0][1]).toBe(byte3);
    expect(instruction.exec.mock.calls[0][2]).toBe(byte4);
});
