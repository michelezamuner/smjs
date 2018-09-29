const Interpreter = require('../../../src/Interpreter/Interpreter');
const InterpreterInterface = require('../../../src/ProcessorArchitecture/Interpreter');
const Mnemonics = require('../../../src/Interpreter/Mnemonics');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const Double = require('../../../src/DataTypes/Double');
const random = require('../random');

/**
 * @type {null|Interpreter}
 */
let interpreter = null;

/**
 * @type {null|Object}
 */
let registers = null;

/**
 * @type {null|Object}
 */
let normalizer = null;

beforeEach(() => {
    registers = {
        eax: new Byte(0x00),
        ebx: new Byte(0x01),
        get: jest.fn(),
        set: jest.fn(),
        setExit: jest.fn(),
        setEs: jest.fn(),
    };
    normalizer = {normalize: jest.fn()};
    interpreter = new Interpreter(registers, normalizer);
});

test('implements interpreter interface', () => {
    expect(interpreter instanceof InterpreterInterface).toBe(true);
});

test('implements move with register addressing', () => {
    const value = random(Word);
    const instructionBytes = [Mnemonics.mov, registers.eax, registers.ebx, new Byte(0x00)];
    const instruction = new Double(...instructionBytes);

    registers.get = jest.fn(reg => reg.equals(registers.ebx) ? new Word(value) : new Word(0x00));
    registers.getIr = jest.fn(() => instruction);
    normalizer.normalize = jest.fn(data => data === instruction ? instructionBytes : []);

    interpreter.exec();

    expect(registers.get.mock.calls[0][0]).toEqual(registers.ebx);
    expect(registers.set.mock.calls[0][0]).toEqual(registers.eax);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(value));
});

test('implements move with immediate addressing', () => {
    const value = random(Byte);
    const instructionBytes = [Mnemonics.movi, registers.eax, new Byte(value), new Byte(0x00)];
    const instruction = new Double(...instructionBytes);

    registers.getIr = jest.fn(() => instruction);
    normalizer.normalize = jest.fn(data => data === instruction ? instructionBytes : []);

    interpreter.exec();

    expect(registers.set.mock.calls[0][0]).toEqual(registers.eax);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(value));
});

test('implements syscall exit', () => {
    const value = random(Word);
    const instructionBytes = [Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];
    const instruction = new Double(...instructionBytes);

    registers.getIr = jest.fn(() => instruction);
    normalizer.normalize = jest.fn(data => data === instruction ? instructionBytes : []);
    registers.get = jest.fn(reg => reg.equals(registers.eax) ? Interpreter.SYS_EXIT : new Word(value));

    interpreter.exec();

    expect(registers.setExit).toHaveBeenCalled();
    expect(registers.setEs.mock.calls[0][0]).toEqual(new Word(value));
});
