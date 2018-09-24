const Interpreter = require('../../../src/Processor/Interpreter');
const Registers = require('../../../src/Processor/Registers');
const Byte = require('../../../src/Processor/DataTypes/Byte');

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
        setMain: jest.fn(),
        getMain: jest.fn(),
        et: new Byte(0),
        es: new Byte(0),
    };
    interpreter = new Interpreter(registers);
    random = Math.floor(Math.random() * 10);
});

test('implements move with immediate addressing', () => {
    interpreter.mov(['eax', random]);

    expect(registers.setMain.mock.calls[0][0]).toBe(Registers.REG_EAX);
    expect(registers.setMain.mock.calls[0][1]).toEqual(random);
});

test('implements move with register addressing', () => {
    registers.getMain = jest.fn(reg => new Byte(reg === Registers.REG_EBX ? random : undefined));
    interpreter.mov(['eax', 'ebx']);

    expect(registers.getMain.mock.calls[0][0]).toBe(Registers.REG_EBX);
    expect(registers.setMain.mock.calls[0][0]).toBe(Registers.REG_EAX);
    expect(registers.setMain.mock.calls[0][1]).toEqual(new Byte(random));
});

test('implements syscall exit', () => {
    registers.getMain = jest.fn(reg => new Byte(reg === 'eax' ? Interpreter.SYS_EXIT : random));
    interpreter.syscall([]);

    expect(registers.et).toEqual(new Byte(1));
    expect(registers.es).toEqual(new Byte(random));
});
