const InterpreterInterface = require('../../../../src/ProcessorProtocol/Interpreter');
const Exit = require('../../../../src/ProcessorProtocol/Exit');
const Interpreter = require('../../../../src/ProcessorArchitectures/SMA/Interpreter');
const Mnemonics = require('../../../../src/ProcessorArchitectures/SMA/Mnemonics');
const Byte = require('../../../../src/DataTypes/Byte');
const Word = require('../../../../src/DataTypes/Word');
const random = require('../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {null|Interpreter}
 */
let interpreter = null;

beforeEach(() => {
    registers.eax = new Byte(0x00);
    registers.ebx = new Byte(0x01);
    registers.set = jest.fn();
    registers.setExit = jest.fn();
    registers.setEs = jest.fn();
    interpreter = new Interpreter(registers, memory);
});

test('implements interpreter interface', () => {
    expect(interpreter instanceof InterpreterInterface).toBe(true);
});

test('provides instructions size', () => {
    expect(interpreter.getInstructionSize()).toEqual(new Byte(4));
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

test('implements move byte with memory addressing from memory into register', () => {
    const addrLeft = random(Byte);
    const addrRight = random(Byte);
    const value = random(Byte);
    const instruction = [Mnemonics.movmb, registers.eax, new Byte(addrLeft), new Byte(addrRight)];

    memory.read = address => {
        if (address.equals(new Word(new Byte(addrLeft), new Byte(addrRight)))) {
            return new Byte(value);
        }

        return new Byte(0x00);
    };

    const exit = interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][0]).toEqual(registers.eax);
    expect(registers.set.mock.calls[0][1]).toBeInstanceOf(Word);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(new Byte(0x00), new Byte(value)));
    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(false);
});

test('implements move word with memory addressing from memory into register', () => {
    const addrLeft = new Byte(random(Byte));
    const addrRight = new Byte(random(Byte));
    const valLeft = new Byte(random(Byte));
    const valRight = new Byte(random(Byte));
    const instruction = [Mnemonics.movmw, registers.eax, addrLeft, addrRight];

    memory.readSet = (address, size) => {
        if (address.equals(new Word(addrLeft, addrRight)) && size.equals(new Byte(0x02))) {
            return [valLeft, valRight];
        }

        return [];
    };

    const exit = interpreter.exec(instruction);

    expect(registers.set).toBeCalledWith(registers.eax, new Word(valLeft, valRight));
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
