const InterpreterInterface = require('../../../../src/ProcessorInterfaces/Interpreter');
const Exit = require('../../../../src/ProcessorInterfaces/Exit');
const Interpreter = require('../../../../src/Architectures/SMA/Interpreter');
const Mnemonics = require('../../../../src/Architectures/SMA/Mnemonics');
const Byte = require('../../../../src/DataTypes/Byte');
const Word = require('../../../../src/DataTypes/Word');
const Double = require('../../../../src/DataTypes/Double');
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

test('implements move register to register', () => {
    const value = random(Double);
    const instruction = [Mnemonics.mov, Mnemonics.eax, Mnemonics.ebx, new Byte(0x00)];

    registers.get = jest.fn(() => new Double(value));

    interpreter.exec(instruction);

    expect(registers.get.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.get.mock.calls[0][0]).toEqual(Mnemonics.ebx);
    expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][0]).toEqual(Mnemonics.eax);
    expect(registers.set.mock.calls[0][1]).toBeInstanceOf(Double);
    expect(registers.set.mock.calls[0][1]).toEqual(new Double(value));
});

test('implements move immediate to register', () => {
    const value = random(Byte);
    const instruction = [Mnemonics.movi, Mnemonics.al, new Byte(value), new Byte(0x00)];

    interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][0]).toEqual(Mnemonics.al);
    expect(registers.set.mock.calls[0][1]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][1]).toEqual(new Byte(value));
});

test('implements move immediate to memory', () => {
    const value = new Byte(random(Byte));
    const addrLeft = new Byte(random(Byte));
    const addrRight = new Byte(random(Byte));
    const instruction = [Mnemonics.movim, addrLeft, addrRight, value];

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toBeInstanceOf(Word);
    expect(memory.write.mock.calls[0][0]).toEqual(new Word(addrLeft, addrRight));
    expect(memory.write.mock.calls[0][1]).toBeInstanceOf(Byte);
    expect(memory.write.mock.calls[0][1]).toEqual(value);
});

test('implements move memory byte to register', () => {
    const addrLeft = new Byte(random(Byte));
    const addrRight = new Byte(random(Byte));
    const value = new Byte(random(Byte));
    const instruction = [Mnemonics.movmb, Mnemonics.ah, addrLeft, addrRight];

    memory.read = address => address.eq(new Word(addrLeft, addrRight)) ? value : new Byte(0x00);

    interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][0]).toEqual(Mnemonics.ah);
    expect(registers.set.mock.calls[0][1]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][1]).toEqual(value);
});

test('implements move memory word to register', () => {
    const addrLeft = new Byte(random(Byte));
    const addrRight = new Byte(random(Byte));
    const valLeft = new Byte(random(Byte));
    const valRight = new Byte(random(Byte));
    const instruction = [Mnemonics.movmw, Mnemonics.ax, addrLeft, addrRight];

    memory.readSet = (address, size) => {
        if (address.eq(new Word(addrLeft, addrRight)) && size.eq(new Byte(0x02))) {
            return [valLeft, valRight];
        }

        return [];
    };

    interpreter.exec(instruction);

    expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
    expect(registers.set.mock.calls[0][0]).toEqual(Mnemonics.ax);
    expect(registers.set.mock.calls[0][1]).toBeInstanceOf(Word);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(valLeft, valRight));
});

test('implements move register to memory', () => {
    const valueLeft = new Byte(random(Byte));
    const valueRight = new Byte(random(Byte));
    const addrLeft = new Byte(random(Byte));
    const addrRight = new Byte(random(Byte));
    let instruction = [Mnemonics.movrm, addrLeft, addrRight, Mnemonics.ax];

    registers.get = register => register.eq(Mnemonics.ax) ? new Word(valueLeft, valueRight) : new Word(0x00);

    interpreter.exec(instruction);

    expect(memory.write.mock.calls[0][0]).toBeInstanceOf(Word);
    expect(memory.write.mock.calls[0][0]).toEqual(new Word(addrLeft, addrRight));
    expect(memory.write.mock.calls[0][1]).toBeInstanceOf(Byte);
    expect(memory.write.mock.calls[0][1]).toEqual(valueLeft);
    expect(memory.write.mock.calls[1][0]).toBeInstanceOf(Word);
    expect(memory.write.mock.calls[1][0]).toEqual((new Word(addrLeft, addrRight)).add(new Byte(0x01)));
    expect(memory.write.mock.calls[1][1]).toBeInstanceOf(Byte);
    expect(memory.write.mock.calls[1][1]).toEqual(valueRight);

    instruction = [Mnemonics.movrm, addrLeft, addrRight, Mnemonics.al];

    registers.get = register => register.eq(Mnemonics.al) ? valueLeft : new Byte(0x00);

    interpreter.exec(instruction);

    expect(memory.write).toBeCalledWith(new Word(addrLeft, addrRight), valueLeft);
});

test('implements syscall exit', () => {
    let instruction = [Mnemonics.mov, Mnemonics.al, Mnemonics.bl, new Byte(0x00)];
    let exit = interpreter.exec(instruction);

    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(false);

    const value = new Byte(random(Byte));
    instruction = [Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];

    registers.get = jest.fn(register => register.eq(Mnemonics.al) ? Interpreter.SYS_EXIT : value);

    exit = interpreter.exec(instruction);

    expect(registers.get).nthCalledWith(1, Mnemonics.al);
    expect(registers.get).nthCalledWith(2, Mnemonics.bl);
    expect(exit).toBeInstanceOf(Exit);
    expect(exit.shouldExit()).toBe(true);
    expect(exit.getExitStatus()).toEqual(value);
});
