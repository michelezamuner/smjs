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

test('fails if size mismatch on move register to register', () => {
    const combinations = [
        ['al', 'bx'], ['al', 'ebx'], ['ah', 'bx'], ['ah', 'ebx'],
        ['ax', 'bl'], ['ax', 'bh'], ['ax', 'ebx'], ['eax', 'bl'],
        ['eax', 'bh'], ['eax', 'bx']
    ];
    for (let [first, second] of combinations) {
        const instruction = [Mnemonics.mov, Mnemonics[first], Mnemonics[second], new Byte(0x00)];
        const [target, source] = [Mnemonics[first].uint().toString(16), Mnemonics[second].uint().toString(16)];

        expect(() => interpreter.exec(instruction)).toThrow(`Cannot move register 0x${source} to register 0x${target}`);
    }
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

test('fails if size mismatch on move immediate to register', () => {
    const value = new Byte(random(Byte));
    const forbidden = ['ax', 'eax', 'bx', 'ebx', 'cx', 'ecx', 'dx', 'edx'];
    for (let register of forbidden) {
        const instruction = [Mnemonics.movi, Mnemonics[register], value, new Byte(0x00)];
        expect(() => interpreter.exec(instruction))
            .toThrow(`Cannot move immediate value to register 0x${Mnemonics[register].uint().toString(16)}`);
    }
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

test('implements move memory to register', () => {
    for (let type of [[Byte, Mnemonics.ah, 1], [Word, Mnemonics.ax, 2], [Double, Mnemonics.eax, 4]]) {
        registers.set = jest.fn();
        const mem = new Word(random(Word));
        const value = new type[0](random(type[0]));
        const valueb = type[0] === Byte ? [value] : value.toBytes();
        const instruction = [Mnemonics.movm, type[1], ...mem.toBytes()];

        if (type[0] === Byte) {
            memory.read = addr => addr.eq(mem) ? value : new Byte(0x00);
        } else {
            memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type[2])) ? valueb : [];
        }

        interpreter.exec(instruction);

        expect(registers.set.mock.calls[0][0]).toBeInstanceOf(Byte);
        expect(registers.set.mock.calls[0][0]).toEqual(type[1]);
        expect(registers.set.mock.calls[0][1]).toBeInstanceOf(type[0]);
        expect(registers.set.mock.calls[0][1]).toEqual(value);
    }
});

test('implements move register to memory', () => {
    for (let type of [[Byte, Mnemonics.ah, 1], [Word, Mnemonics.ax, 2], [Double, Mnemonics.eax, 4]]) {
        memory.write = jest.fn();
        const mem = new Word(random(Word));
        const value = new type[0](random(type[0]));
        const valueb = type[0] === Byte ? [value] : value.toBytes();
        const instruction = [Mnemonics.movrm, ...mem.toBytes(), type[1]];

        registers.get = reg => reg.eq(type[1]) ? value : new type[0](0x00);

        interpreter.exec(instruction);

        for (let i = 0; i < type[2]; i++) {
            expect(memory.write.mock.calls[i][0]).toBeInstanceOf(Word);
            expect(memory.write.mock.calls[i][0]).toEqual(mem.add(new Byte(i)));
            expect(memory.write.mock.calls[i][1]).toBeInstanceOf(Byte);
            expect(memory.write.mock.calls[i][1]).toEqual(valueb[i]);
        }
    }
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
