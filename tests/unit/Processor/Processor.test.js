const Processor = require('../../../src/Processor/Processor');
const Byte = require('../../../src/Processor/DataTypes/Byte');
const Word = require('../../../src/Processor/DataTypes/Word');

/**
 * @type {null|Object}
 */
let interpreter = null;

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
    interpreter = {
        exec: jest.fn(),
    };
    let ip = new Word(0x00);
    registers = {
        getIs: jest.fn(() => 4),
        getIp: jest.fn(() => ip),
        incrementIp: jest.fn(() => ip = new Word(ip.get() + 4)),
        shouldExit: jest.fn(() => false),
        getEs: jest.fn(() => new Word(0x00)),
    };
    processor = new Processor(interpreter, registers);
    random = Math.floor(Math.random() * 10);
});

test('returns exit status ok if no instruction is executed', () => {
    const exitStatus = processor.run([]);

    expect(exitStatus).toBe(0);
    expect(interpreter.exec.mock.calls.length).toBe(0);
    expect(registers.shouldExit()).toBe(false);
    expect(registers.getEs()).toEqual(new Word(0x00));
});

test('executes the given instructions in sequence and returns exit status zero', () => {
    const bytes = [
        new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03),
        new Byte(0x04), new Byte(0x05), new Byte(0x06), new Byte(0x07),
        new Byte(0x08), new Byte(0x09), new Byte(0x0A), new Byte(0x0B),
    ];

    const exitStatus = processor.run(bytes);

    expect(exitStatus).toBe(0);
    expect(interpreter.exec.mock.calls.length).toBe(3);
    expect(interpreter.exec.mock.calls[0][0]).toEqual([new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03)]);
    expect(interpreter.exec.mock.calls[1][0]).toEqual([new Byte(0x04), new Byte(0x05), new Byte(0x06), new Byte(0x07)]);
    expect(interpreter.exec.mock.calls[2][0]).toEqual([new Byte(0x08), new Byte(0x09), new Byte(0x0A), new Byte(0x0B)]);
});

test('exits with exit registers skipping following instructions', () => {
    interpreter.exec = ([opcode, op1]) => {
        if (!opcode.equals(new Byte(0x00))) {
            return;
        }
        registers.shouldExit = jest.fn(() => true);
        registers.getEs = jest.fn(() => new Word(new Byte(0x00), op1));
    };

    const bytes = [
        new Byte(0x01), new Byte(0x00), new Byte(0x00), new Byte(0x00),
        new Byte(0x00), new Byte(random), new Byte(0x00), new Byte(0x00),
        new Byte(0x02), new Byte(0x03), new Byte(0x04), new Byte(0x05),
    ];

    const exitStatus = processor.run(bytes);

    expect(exitStatus).toBe(random);
});

test('exits with exit status registers as last instruction', () => {
    interpreter.exec = ([opcode, op1]) => {
        if (!opcode.equals(new Byte(0x00))) {
            return;
        }
        registers.shouldExit = jest.fn(() => true);
        registers.getEs = jest.fn(() => new Word(new Byte(0x00), op1));
    };

    const bytes = [
        new Byte(0x00), new Byte(random), new Byte(0x00), new Byte(0x00),
    ];

    const exitStatus = processor.run(bytes);

    expect(exitStatus).toBe(random);
});
