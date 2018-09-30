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
 * @type {Object}
 */
let registers = {};

/**
 * @type {Object}
 */
let normalizer = {};

beforeEach(() => {
    registers.eax = new Byte(0x00);
    registers.ebx = new Byte(0x01);
    registers.set = jest.fn();
    registers.setExit = jest.fn();
    registers.setEs = jest.fn();
    interpreter = new Interpreter(registers, normalizer);
});

test('implements interpreter interface', () => {
    expect(interpreter instanceof InterpreterInterface).toBe(true);
});

test('implements move with register addressing', () => {
    const value = random(Word);
    const instructionBytes = [Mnemonics.mov, registers.eax, registers.ebx, new Byte(0x00)];
    const instruction = new Double(...instructionBytes);

    registers.get = jest.fn(() => new Word(value));
    registers.getIr = () => instruction;
    normalizer.normalize = jest.fn(() => instructionBytes);

    interpreter.exec();

    expect(normalizer.normalize).toBeCalledWith(instruction);
    expect(registers.get).toBeCalledWith(registers.ebx);
    expect(registers.set).toBeCalledWith(registers.eax, new Word(value));
});

test('implements move with immediate addressing', () => {
    const value = random(Byte);
    const instructionBytes = [Mnemonics.movi, registers.eax, new Byte(value), new Byte(0x00)];
    const instruction = new Double(...instructionBytes);

    registers.getIr = () => instruction;
    normalizer.normalize = jest.fn(() => instructionBytes);

    interpreter.exec();

    expect(normalizer.normalize).toBeCalledWith(instruction);
    expect(registers.set).toBeCalledWith(registers.eax, new Word(value));
});

test('implements syscall exit', () => {
    const value = random(Word);
    const instructionBytes = [Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];
    const instruction = new Double(...instructionBytes);

    registers.get = jest.fn(register => register.equals(registers.eax) ? Interpreter.SYS_EXIT : new Word(value));
    registers.getIr = () => instruction;
    normalizer.normalize = jest.fn(() => instructionBytes);

    interpreter.exec();

    expect(normalizer.normalize).toBeCalledWith(instruction);
    expect(registers.get).nthCalledWith(1, registers.eax);
    expect(registers.get).nthCalledWith(2, registers.ebx);
    expect(registers.setExit).toBeCalled();
    expect(registers.setEs).toBeCalledWith(new Word(value));
});
