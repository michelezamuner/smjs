const InterpreterInterface = require('../../../../src/ProcessorInterfaces/Interpreter');
const Exit = require('../../../../src/ProcessorInterfaces/Exit');
const Interpreter = require('../../../../src/Architectures/SMA/Interpreter');
const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
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
    memory.write = jest.fn();
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
    const instruction = [Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)];

    registers.get = jest.fn(() => new Word(value));

    interpreter.exec(instruction);

    expect(registers.get.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.get.mock.calls[0][0]).toEqual(Mnemonics.ebx);
    expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][0]).toEqual(Mnemonics.eax);
    expect(registers.set.mock.calls[0][1]).toBeInstanceOf(Word);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(value));
});

test('implements move with immediate addressing', () => {
    const value = random(Byte);
    const instruction = [Mnemonics.movi, Mnemonics.eax, new Byte(value), new Byte(0x00)];

    interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][0]).toEqual(Mnemonics.eax);
    expect(registers.set.mock.calls[0][1]).toBeInstanceOf(Word);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(value));
});

test('implements move byte with direct memory addressing from memory into register', () => {
    const addrLeft = random(Byte);
    const addrRight = random(Byte);
    const value = random(Byte);
    const instruction = [Mnemonics.movmb, Mnemonics.eax, new Byte(addrLeft), new Byte(addrRight)];

    memory.read = address => {
        if (address.equals(new Word(new Byte(addrLeft), new Byte(addrRight)))) {
            return new Byte(value);
        }

        return new Byte(0x00);
    };

    interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][0]).toEqual(Mnemonics.eax);
    expect(registers.set.mock.calls[0][1]).toBeInstanceOf(Word);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(new Byte(0x00), new Byte(value)));
});

test('implements move word with direct memory addressing from memory into register', () => {
    const addrLeft = new Byte(random(Byte));
    const addrRight = new Byte(random(Byte));
    const valLeft = new Byte(random(Byte));
    const valRight = new Byte(random(Byte));
    const instruction = [Mnemonics.movmw, Mnemonics.eax, addrLeft, addrRight];

    memory.readSet = (address, size) => {
        if (address.equals(new Word(addrLeft, addrRight)) && size.equals(new Byte(0x02))) {
            return [valLeft, valRight];
        }

        return [];
    };

    interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][0]).toEqual(Mnemonics.eax);
    expect(registers.set.mock.calls[0][1]).toBeInstanceOf(Word);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(valLeft, valRight));
});

test('implements move byte with direct memory addressing from register into memory', () => {
    const valueLeft = new Byte(random(Byte));
    const valueRight = new Byte(random(Byte));
    const addrLeft = new Byte(random(Byte));
    const addrRight = new Byte(random(Byte));
    const instruction = [Mnemonics.movmr, addrLeft, addrRight, Mnemonics.eax];

    registers.get = register => register.equals(Mnemonics.eax) ? new Word(valueLeft, valueRight) : new Byte(0x00);

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toBeInstanceOf(Word);
    expect(memory.write.mock.calls[0][0]).toEqual(new Word(addrLeft, addrRight));
    expect(memory.write.mock.calls[0][1]).toBeInstanceOf(Byte);
    expect(memory.write.mock.calls[0][1]).toEqual(valueLeft);
    expect(memory.write.mock.calls[1][0]).toBeInstanceOf(Word);
    expect(memory.write.mock.calls[1][0]).toEqual((new Word(addrLeft, addrRight)).add(new Byte(0x01)));
    expect(memory.write.mock.calls[1][1]).toBeInstanceOf(Byte);
    expect(memory.write.mock.calls[1][1]).toEqual(valueRight);
});

test('implements move to memory with immediate addressing', () => {
    const value = new Byte(random(Byte));
    const addrLeft = new Byte(random(Byte));
    const addrRight = new Byte(random(Byte));
    const instruction = [Mnemonics.movmi, addrLeft, addrRight, value];

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toBeInstanceOf(Word);
    expect(memory.write.mock.calls[0][0]).toEqual(new Word(addrLeft, addrRight));
    expect(memory.write.mock.calls[0][1]).toBeInstanceOf(Byte);
    expect(memory.write.mock.calls[0][1]).toEqual(value);
});

test('implements syscall exit', () => {
    let instruction = [Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)];
    let exit = interpreter.exec(instruction);

    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(false);

    const value = random(Word);
    instruction = [Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];

    registers.get = jest.fn(register => register.equals(Mnemonics.eax) ? Interpreter.SYS_EXIT : new Word(value));

    exit = interpreter.exec(instruction);

    expect(registers.get).nthCalledWith(1, Mnemonics.eax);
    expect(registers.get).nthCalledWith(2, Mnemonics.ebx);
    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(true);
    expect(exit.getExitStatus()).toEqual(new Word(value));
});
