const Processor = require('../../../src/Processor/Processor');
const MissingExitException = require('../../../src/Processor/MissingExitException');
const Exit = require('../../../src/ProcessorInterfaces/Exit');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const random = require('../random');

/**
 * @type {Object}
 */
const interpreter = {};

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {Word}
 */
let ip = new Word();

/**
 * @type {null|Processor}
 */
let processor = null;

beforeEach(() => {
    interpreter.getInstructionSize = () => new Byte(4);
    interpreter.exec = jest.fn(() => new Exit);

    registers.getIp = () => ip;
    registers.setIp = value => ip = value;
    registers.shouldExit = () => false;

    memory.getMax = () => new Word(0xFFFF);
    memory.read = jest.fn((address, size) => {
        const bytes = [];
        for (let i = new Byte(); i.lt(size); i = i.inc()) {
            bytes.push(address.add(new Byte(i)));
        }
        return bytes;
    });

    processor = new Processor(interpreter, registers, memory);
});

test('executes the given instructions in sequence and exits with exit context', () => {
    const value = random(Byte);

    interpreter.exec = jest.fn(() => registers.getIp().eq(new Word(0x08))
        ? registers.shouldExit = () => true
        : registers.getExitStatus = () => value
    );

    const exitStatus = processor.run();

    expect(memory.read).toBeCalledTimes(2);
    expect(interpreter.exec).toBeCalledTimes(2);
    expect(interpreter.exec).nthCalledWith(1, [new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03)]);
    expect(interpreter.exec).nthCalledWith(2, [new Byte(0x04), new Byte(0x05), new Byte(0x06), new Byte(0x07)]);
    expect(exitStatus).toBe(parseInt(value));
});

test('fails with missing exit if read set goes out of memory', () => {
    ip = new Word(0xFFFF);
    expect(() => processor.run()).toThrow(MissingExitException);
    expect(memory.read).toBeCalledTimes(0);
    expect(interpreter.exec).toBeCalledTimes(0);
});

test('fails with missing exit if next ip goes out of bounds', () => {
    ip = new Byte(0xFF);
    expect(() => processor.run()).toThrow(MissingExitException);
    expect(memory.read).toBeCalledTimes(0);
    expect(interpreter.exec).toBeCalledTimes(0);
});
