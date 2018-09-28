const Interpreter = require('../../../src/Interpreter/Interpreter');
const Mnemonics = require('../../../src/Interpreter/Mnemonics');
const Byte = require('../../../src/Processor/DataTypes/Byte');
const Word = require('../../../src/Processor/DataTypes/Word');

/**
 * @type {null|Interpreter}
 */
let interpreter = null;

/**
 * @type {null|Object}
 */
let registers = null;

/**
 * @type {null|number}
 */
let random = null;

beforeEach(() => {
    registers = {
        get: jest.fn(),
        set: jest.fn(),
        setExit: jest.fn(),
        setEs: jest.fn(),
    };
    interpreter = new Interpreter(registers);
    random = Math.floor(Math.random() * Word.MAX);
});

test('implements move with register addressing', () => {
    registers.eax = new Byte(0x00);
    registers.ebx = new Byte(0x01);
    registers.get = jest.fn(reg => new Word(reg.equals(registers.ebx) ? random : undefined));

    const bytes = [Mnemonics.mov, registers.eax, registers.ebx, new Byte(0x00)];

    interpreter.exec(bytes);

    expect(registers.get.mock.calls[0][0]).toEqual(registers.ebx);
    expect(registers.set.mock.calls[0][0]).toEqual(registers.eax);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(random));
});

test('implements move with immediate addressing', () => {
    const random = Math.floor(Math.random() * Byte.MAX);

    registers.eax = new Byte(0x00);
    const bytes = [Mnemonics.movi, registers.eax, new Byte(random), new Byte(0x00)];

    interpreter.exec(bytes);

    expect(registers.set.mock.calls[0][0]).toEqual(registers.eax);
    expect(registers.set.mock.calls[0][1]).toEqual(new Word(random));
});

test('implements syscall exit', () => {
    registers.eax = new Byte(0x00);
    registers.ebx = new Byte(0x01);
    registers.get = jest.fn(reg => new Word(reg.equals(registers.eax) ? Interpreter.SYS_EXIT : random));

    const bytes = [Mnemonics.syscall, new Byte(0x00), new Byte(0x00), new Byte(0x00)];

    interpreter.exec(bytes);

    expect(registers.setExit).toHaveBeenCalled();
    expect(registers.setEs.mock.calls[0][0]).toEqual(new Word(random));
});
