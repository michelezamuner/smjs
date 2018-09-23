const InstructionSet = require('../../../src/Processor/InstructionSet');
const Registers = require('../../../src/Processor/Registers');
const Byte = require('../../../src/Processor/DataTypes/Byte');

/**
 * @type {null|InstructionSet}
 */
let instructionSet = null;

/**
 * @type {null|number}
 */
let code = null;

beforeEach(() => {
    instructionSet = new InstructionSet;
    code = Math.floor(Math.random() * 10);
});

test('implements move with immediate value', () => {
    const registers = {
        setMain: jest.fn(),
    };

    instructionSet.mov(['eax', code], registers);

    expect(registers.setMain.mock.calls.length).toBe(1);
    expect(registers.setMain.mock.calls[0][0]).toBe('eax');
    expect(registers.setMain.mock.calls[0][1]).toBe(code);
});

test('implements syscall exit', () => {
    const registers = {
        getMain: jest.fn(reg => new Byte(reg === 'eax' ? InstructionSet.SYS_EXIT : code)),
        setStatus: jest.fn(),
    };

    instructionSet.syscall([], registers);

    expect(registers.setStatus.mock.calls.length).toBe(1);
    expect(registers.setStatus.mock.calls[0][0]).toBe(Registers.REG_ESC);
    expect(registers.setStatus.mock.calls[0][1]).toEqual(new Byte(code));
});
