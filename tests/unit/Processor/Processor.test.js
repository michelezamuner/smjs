const Processor = require('../../../src/Processor/Processor');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const Double = require('../../../src/DataTypes/Double');
const random = require('../random');
const Normalizer = require('../../../src/DataTypes/Normalizer');

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
        setIr: jest.fn(),
    };
    processor = new Processor(interpreter, registers);
});

test('returns exit status ok if no instruction is executed', () => {
    const exitStatus = processor.run([]);

    expect(exitStatus).toBe(0);
    expect(interpreter.exec.mock.calls.length).toBe(0);
    expect(registers.shouldExit()).toBe(false);
    expect(registers.getEs()).toEqual(new Word(0x00));
});

test('executes the given instructions in sequence and returns exit status zero', () => {
    const instructions = [
        [new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03)],
        [new Byte(0x04), new Byte(0x05), new Byte(0x06), new Byte(0x07)],
        [new Byte(0x08), new Byte(0x09), new Byte(0x0A), new Byte(0x0B)],
    ];

    const exitStatus = processor.run([...instructions[0], ...instructions[1], ...instructions[2]]);

    expect(exitStatus).toBe(0);
    expect(interpreter.exec.mock.calls.length).toBe(3);
    expect(registers.setIr.mock.calls.length).toBe(3);
    expect(registers.setIr.mock.calls[0][0]).toEqual(new Double(...instructions[0]));
    expect(registers.setIr.mock.calls[1][0]).toEqual(new Double(...instructions[1]));
    expect(registers.setIr.mock.calls[2][0]).toEqual(new Double(...instructions[2]));
});

test('exits with exit registers skipping following instructions', () => {
    const value = random(Byte);
    const instructions = [
        [new Byte(0x01), new Byte(0x00), new Byte(0x00), new Byte(0x00)],
        [new Byte(0x00), new Byte(value), new Byte(0x00), new Byte(0x00)],
        [new Byte(0x02), new Byte(0x03), new Byte(0x04), new Byte(0x05)]
    ];

    registers.setIr = instruction => registers.ir = instruction;
    interpreter.exec = () => {
        const instruction = (new Normalizer).normalize(registers.ir);
        if (instruction[0].equals(new Byte(0x00))) {
            registers.shouldExit = () => true;
            registers.getEs = () => new Word(new Byte(0x00), instruction[1]);
        }
    };

    const exitStatus = processor.run([...instructions[0], ...instructions[1], ...instructions[2]]);

    expect(exitStatus).toBe(value);
});

test('exits with exit status registers as last instruction', () => {
    const value = random(Byte);
    const instructions = [new Byte(0x00), new Byte(value), new Byte(0x00), new Byte(0x00)];

    registers.setIr = instruction => registers.ir = instruction;
    interpreter.exec = () => {
        const instruction = (new Normalizer).normalize(registers.ir);
        if (instruction[0].equals(new Byte(0x00))) {
            registers.shouldExit = () => true;
            registers.getEs = () => new Word(new Byte(0x00), instruction[1]);
        }
    };

    const exitStatus = processor.run(instructions);

    expect(exitStatus).toBe(value);
});
