const Processor = require('../../../src/Processor/Processor');

/**
 * @type {null|Object}
 */
let instructionSet = null;

/**
 * @type {null|Object}
 */
let registers = null;

/**
 * @type {null|Processor}
 */
let processor = null;

beforeEach(() => {
    instructionSet = {
        test: jest.fn(),
    };
    registers = {
        ip: 0,
        getStatus: jest.fn(),
        setStatus: jest.fn((_, status) => registers.getStatus = jest.fn(() => status)),
    };
    processor = new Processor(instructionSet, registers);
});

test('returns exit status zero if no instruction is executed', () => {
    const exitStatus = processor.run([]);

    expect(exitStatus).toBe(0);
    expect(registers.ip).toBe(0);
});

test('executes the given instructions in sequence and returns exit status zero', () => {
    const instructions = [
        {opcode: 'test', operands: [1]},
        {opcode: 'test', operands: [2]},
        {opcode: 'test', operands: [3]},
    ];

    const exitStatus = processor.run(instructions);

    expect(exitStatus).toBe(0);
    expect(instructionSet.test.mock.calls.length).toBe(3);
    expect(instructionSet.test.mock.calls[0][0]).toEqual([1]);
    expect(instructionSet.test.mock.calls[1][0]).toEqual([2]);
    expect(instructionSet.test.mock.calls[2][0]).toEqual([3]);
});

test('exits with esc status register', () => {
    instructionSet.exit = ([op], registers) => {
        registers.getStatus = jest.fn(() => op);
    };

    const code = Math.floor(Math.random() * 10);
    const instructions = [
        {opcode: 'test', operands: ['smt']},
        {opcode: 'exit', operands: [code]},
        {opcode: 'test', operands: ['will never be written']},
    ];

    const exitStatus = processor.run(instructions);

    expect(exitStatus).toBe(code);
    expect(instructionSet.test.mock.calls.length).toBe(1);
    expect(instructionSet.test.mock.calls[0][0]).toEqual(['smt']);
});
