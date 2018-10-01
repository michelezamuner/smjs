const Interpreter = require('../../../src/Interpreter/Interpreter');
const InterpreterInterface = require('../../../src/ProcessorArchitecture/Interpreter');
const Exit = require('../../../src/ProcessorArchitecture/Exit');
const Mnemonics = require('../../../src/Interpreter/Mnemonics');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const random = require('../random');

/**
 * @type {null|Interpreter}
 */
let interpreter = null;

/**
 * @type {Object}
 */
let registers = {};

beforeEach(() => {
    registers.eax = new Byte(0x00);
    registers.ebx = new Byte(0x01);
    registers.set = jest.fn();
    registers.setExit = jest.fn();
    registers.setEs = jest.fn();
    interpreter = new Interpreter(registers);
});

test('implements interpreter interface', () => {
    expect(interpreter instanceof InterpreterInterface).toBe(true);
});

test('implements move with register addressing', () => {
    const value = random(Word);
    const instruction = [Mnemonics.mov, registers.eax, registers.ebx, new Byte(0x00)];

    registers.get = jest.fn(() => new Word(value));

    const exit = interpreter.exec(instruction);

    expect(registers.get).toBeCalledWith(registers.ebx);
    expect(registers.set).toBeCalledWith(registers.eax, new Word(value));
    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(false);
});

test('implements move with immediate addressing', () => {
    const value = random(Byte);
    const instruction = [Mnemonics.movi, registers.eax, new Byte(value), new Byte(0x00)];

    const exit = interpreter.exec(instruction);

    expect(registers.set).toBeCalledWith(registers.eax, new Word(value));
    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(false);
});

test('implements syscall exit', () => {
    const value = random(Word);
    const instruction = [Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];

    registers.get = jest.fn(register => register.equals(registers.eax) ? Interpreter.SYS_EXIT : new Word(value));

    const exit = interpreter.exec(instruction);

    expect(registers.get).nthCalledWith(1, registers.eax);
    expect(registers.get).nthCalledWith(2, registers.ebx);
    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(true);
    expect(exit.getExitStatus()).toEqual(new Word(value));
});
