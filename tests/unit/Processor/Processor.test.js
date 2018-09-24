const Processor = require('../../../src/Processor/Processor');
const Byte = require('../../../src/Processor/DataTypes/Byte');
const Registers = require('../../../src/Processor/Registers');

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

/**
 * @type {null|number}
 */
let random = null;

beforeEach(() => {
    instructionSet = {
        test: jest.fn(),
    };
    registers = {
        et: Registers.EXIT_TRIGGER_OFF,
        es: Registers.EXIT_STATUS_OK,
        ip: 0,
    };
    processor = new Processor(instructionSet, registers);
    random = Math.floor(Math.random() * 10);
});

test('returns exit status ok if no instruction is executed', () => {
    const exitStatus = processor.run([]);

    expect(exitStatus).toBe(Registers.EXIT_STATUS_OK.toInt());
    expect(registers.ip).toBe(0);
});

test('executes the given instructions in sequence and returns exit status zero', () => {
    const instructions = [
        {opcode: 'test', operands: [1]},
        {opcode: 'test', operands: [2]},
        {opcode: 'test', operands: [3]},
    ];

    const exitStatus = processor.run(instructions);

    expect(exitStatus).toBe(Registers.EXIT_STATUS_OK.toInt());
    expect(instructionSet.test.mock.calls.length).toBe(3);
    expect(instructionSet.test.mock.calls[0][0]).toEqual([1]);
    expect(instructionSet.test.mock.calls[1][0]).toEqual([2]);
    expect(instructionSet.test.mock.calls[2][0]).toEqual([3]);
});

test('exits with exit registers skipping following instructions', () => {
    instructionSet.exit = ([op], registers) => {
        registers.et = Registers.EXIT_TRIGGER_ON;
        registers.es = new Byte(op);
    };

    const instructions = [
        {opcode: 'test', operands: ['smt']},
        {opcode: 'exit', operands: [random]},
        {opcode: 'test', operands: ['will never be written']},
    ];

    const exitStatus = processor.run(instructions);

    expect(exitStatus).toBe(random);
});

test('exits with exit status registers as last instruction', () => {
    instructionSet.exit = ([op], registers) => {
        registers.et = Registers.EXIT_TRIGGER_ON;
        registers.es = new Byte(random);
    };

    const instructions = [
        {opcode: 'exit', operands: [random]},
    ];

    const exitStatus = processor.run(instructions);

    expect(exitStatus).toBe(random);
});
