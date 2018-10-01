const Processor = require('../../../src/Processor/Processor');
const Exit = require('../../../src/ProcessorArchitecture/Exit');
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
 * @type {null|Processor}
 */
let processor = null;

beforeEach(() => {
    interpreter.exec = jest.fn(() => new Exit);

    let ip = new Word(0x00);
    registers.getIs = () => 4;
    registers.getIp = () => ip;
    registers.incrementIp = () => ip = new Word(ip.toInt() + registers.getIs());

    memory.readSet = jest.fn((address, size) => {
        const bytes = [];
        for (let i = 0; i < size; i++) {
            bytes.push(new Byte(address.toInt() + i));
        }
        return bytes;
    });

    processor = new Processor(interpreter, registers, memory);
});

test('executes the given instructions in sequence and exits with exit context', () => {
    const value = random(Byte);

    interpreter.exec = jest.fn(() => registers.getIp().equals(new Word(0x04))
        ? new Exit(true, new Word(value))
        : new Exit
    );

    const exitStatus = processor.run();

    expect(memory.readSet).toBeCalledTimes(2);
    expect(interpreter.exec).toBeCalledTimes(2);
    expect(interpreter.exec).nthCalledWith(1, [new Byte(0x00), new Byte(0x01), new Byte(0x02), new Byte(0x03)]);
    expect(interpreter.exec).nthCalledWith(2, [new Byte(0x04), new Byte(0x05), new Byte(0x06), new Byte(0x07)]);
    expect(exitStatus).toBe(value);
});
