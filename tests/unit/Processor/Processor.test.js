const Processor = require('../../../src/Processor/Processor');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const Double = require('../../../src/DataTypes/Double');
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
    interpreter.exec = jest.fn();

    let ip = new Word(0x00);
    registers.getIs = () => 4;
    registers.getIp = () => ip;
    registers.incrementIp = () => ip = new Word(ip.get() + registers.getIs());
    registers.shouldExit = () => false;
    registers.setIr = jest.fn();
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

    expect(registers.setIr).toBeCalledTimes(3);
    expect(registers.setIr).nthCalledWith(1, new Double(...instructions[0]));
    expect(registers.setIr).nthCalledWith(2, new Double(...instructions[1]));
    expect(registers.setIr).nthCalledWith(3, new Double(...instructions[2]));
    expect(interpreter.exec).toBeCalledTimes(3);
    expect(exitStatus).toBe(0);
});

test('exits with exit registers skipping following instructions', () => {
    const value = random(Byte);
    const instructions = [
        [new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03)],
        [new Byte(0x04), new Byte(0x05), new Byte(0x06), new Byte(0x07)],
        [new Byte(0x08), new Byte(0x09), new Byte(0x0A), new Byte(0x0B)],
    ];

    interpreter.exec = jest.fn(() => {
        if (registers.getIp().equals(new Word(0x04))) {
            registers.shouldExit = () => true;
            registers.getEs = () => new Word(value);
        }
    });

    const exitStatus = processor.run([...instructions[0], ...instructions[1], ...instructions[2]]);

    expect(registers.setIr).toBeCalledTimes(2);
    expect(registers.setIr).nthCalledWith(1, new Double(...instructions[0]));
    expect(registers.setIr).nthCalledWith(2, new Double(...instructions[1]));
    expect(interpreter.exec).toBeCalledTimes(2);
    expect(exitStatus).toBe(value);
});

test('exits with exit status registers as last instruction', () => {
    const value = random(Byte);
    const instruction = [new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03)];

    interpreter.exec = jest.fn(() => {
        registers.shouldExit = () => true;
        registers.getEs = () => new Word(value);
    });

    const exitStatus = processor.run(instruction);

    expect(registers.setIr).toBeCalledWith(new Double(...instruction));
    expect(interpreter.exec).toBeCalled();
    expect(exitStatus).toBe(value);
});
