const InstructionSet = require('../../../src/Processor/InstructionSet');
const Registers = require('../../../src/Processor/Registers');
const Byte = require('../../../src/Processor/DataTypes/Byte');

/**
 * @type {null|InstructionSet}
 */
let instructionSet = null;

/**
 * @type {null|Object}
 */
let registers = null;

/**
 * @type {null|number}
 */
let random = null;

beforeEach(() => {
    instructionSet = new InstructionSet;
    registers = {
        setMain: jest.fn(),
        getMain: jest.fn(),
        setStatus: jest.fn(),
    };
    random = Math.floor(Math.random() * 10);
});

test('implements move with immediate addressing', () => {
    instructionSet.mov(['eax', random], registers);

    expect(registers.setMain.mock.calls[0][0]).toBe(Registers.REG_EAX);
    expect(registers.setMain.mock.calls[0][1]).toEqual(random);
});

test('implements move with register addressing', () => {
    registers.getMain = jest.fn(reg => new Byte(reg === Registers.REG_EBX ? random : undefined));
    instructionSet.mov(['eax', 'ebx'], registers);

    expect(registers.getMain.mock.calls[0][0]).toBe(Registers.REG_EBX);
    expect(registers.setMain.mock.calls[0][0]).toBe(Registers.REG_EAX);
    expect(registers.setMain.mock.calls[0][1]).toEqual(new Byte(random));
});

test('implements syscall exit', () => {
    registers.getMain = jest.fn(reg => new Byte(reg === 'eax' ? InstructionSet.SYS_EXIT : random));
    instructionSet.syscall([], registers);

    expect(registers.setStatus.mock.calls[0][0]).toBe(Registers.REG_ESC);
    expect(registers.setStatus.mock.calls[0][1]).toEqual(new Byte(random));
});
