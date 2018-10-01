const Exit = require('../../../src/ProcessorArchitecture/Exit');
const Processor = require('../../../src/Processor/Processor');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const random = require('../random');

/**
 * @type {Object}
 */
let interpreter = {};

/**
 * @type {Object}
 */
let registers = {};

/**
 * @type {null|Processor}
 */
let processor = null;

beforeEach(() => {
    interpreter.exec = jest.fn(() => new Exit);

    let ip = new Word(0x00);
    registers.getIs = () => 4;
    registers.getIp = () => ip;
    registers.incrementIp = () => ip = new Word(ip.toInt() + registers.getIs());
    processor = new Processor(interpreter, registers);
});

test('returns exit status ok if no instruction is executed', () => {
    const exitStatus = processor.run([]);

    expect(interpreter.exec).not.toBeCalled();
    expect(exitStatus).toBe(0);
});

test('executes the given instructions in sequence and returns exit status zero', () => {
    const instructions = [
        [new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03)],
        [new Byte(0x04), new Byte(0x05), new Byte(0x06), new Byte(0x07)],
        [new Byte(0x08), new Byte(0x09), new Byte(0x0A), new Byte(0x0B)],
    ];

    const exitStatus = processor.run([...instructions[0], ...instructions[1], ...instructions[2]]);

    expect(interpreter.exec).toBeCalledTimes(3);
    expect(interpreter.exec).nthCalledWith(1, instructions[0]);
    expect(interpreter.exec).nthCalledWith(2, instructions[1]);
    expect(interpreter.exec).nthCalledWith(3, instructions[2]);
    expect(exitStatus).toBe(0);
});

test('exits with exit registers skipping following instructions', () => {
    const value = random(Byte);
    const instructions = [
        [new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03)],
        [new Byte(0x04), new Byte(0x05), new Byte(0x06), new Byte(0x07)],
        [new Byte(0x08), new Byte(0x09), new Byte(0x0A), new Byte(0x0B)],
    ];

    interpreter.exec = jest.fn(() => registers.getIp().equals(new Word(0x04))
        ? new Exit(true, new Word(value))
        : new Exit
    );

    const exitStatus = processor.run([...instructions[0], ...instructions[1], ...instructions[2]]);

    expect(interpreter.exec).toBeCalledTimes(2);
    expect(interpreter.exec).nthCalledWith(1, instructions[0]);
    expect(interpreter.exec).nthCalledWith(2, instructions[1]);
    expect(exitStatus).toBe(value);
});

test('exits with exit status registers as last instruction', () => {
    const value = random(Byte);
    const instruction = [new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03)];

    interpreter.exec = jest.fn(() => new Exit(true, new Word(value)));

    const exitStatus = processor.run(instruction);

    expect(interpreter.exec).toBeCalledTimes(1);
    expect(interpreter.exec).nthCalledWith(1, instruction);
    expect(exitStatus).toBe(value);
});
