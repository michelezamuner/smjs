const Processor = require('../../../../../src/domain/sloth-machine-framework/processor/Processor');
const ProcessorException = require('../../../../../src/domain/sloth-machine-framework/processor/ProcessorException');
const InvalidAddressException = require('../../../../../src/domain/sloth-machine-framework/program/InvalidAddressException');
const ReadOutOfBoundsException = require('../../../../../src/domain/sloth-machine-framework/program/ReadOutOfBoundsException');
const Data = require('../../../../../src/domain/sloth-machine-framework/data/Data');
const DataUnit = require('../../../../../src/domain/sloth-machine-framework/data/DataUnit');
const Status = require('../../../../../src/domain/sloth-machine-framework/interpreter/Status');
const Size = require('../../../../../src/domain/sloth-machine-framework/data/Size');
const Address = require('../../../../../src/domain/sloth-machine-framework/data/Address');
const Opcode = require('../../../../../src/domain/sloth-machine-framework/interpreter/Opcode');
const Operands = require('../../../../../src/domain/sloth-machine-framework/interpreter/Operands');
const ExitStatus = require('../../../../../src/domain/sloth-machine-framework/interpreter/ExitStatus');
const InterpreterException = require('../../../../../src/domain/sloth-machine-framework/interpreter/InterpreterException');
const random = require('lib/random');

/**
 * @type {Object}
 */
const interpreter = {};

/**
 * @type {null|Processor}
 */
let processor = null;

/**
 * @type {Object}
 */
const opcodeSize = new Size(1);

/**
 * @type {Object}
 */
const program = {};

/**
 * @type {DataUnit[]}
 */
const programData = [
    new DataUnit(random(100)), new DataUnit(random(100)), new DataUnit(random(100)),
    new DataUnit(random(100)),
    new DataUnit(random(100)), new DataUnit(random(100)),
];

/**
 * @type {ExitStatus}
 */
const expectedExitStatus = new ExitStatus(random(100));

/**
 * @type {Object}
 */
const expected = {};

/**
 * @type {number}
 */
let interpreterCall = 0;

beforeEach(() => {
    expected.statuses = [
        new Status(),
        new Status(),
        new Status(null, expectedExitStatus),
    ];
    expected.addresses = [
        new Address(0),
        new Address(3),
        new Address(4),
    ];
    expected.operandsSizes = [
        new Size(2),
        new Size(0),
        new Size(1),
    ];
    expected.opcodes = [
        new Opcode(programData.slice(0, 1)),
        new Opcode(programData.slice(3, 4)),
        new Opcode(programData.slice(4, 5)),
    ];
    expected.operands = [
        new Operands(programData.slice(1, 3)),
        new Operands(),
        new Operands(programData.slice(5, 6)),
    ];
    interpreterCall = 0;
    interpreter.getOpcodeSize = () => opcodeSize;
    interpreter.getOperandsSize = opcode => {
        for (const i in expected.opcodes) {
            if (opcode.eq(expected.opcodes[i])) {
                return expected.operandsSizes[i];
            }
        }

        return null;
    };
    interpreter.exec = instruction => {
        expect(instruction.getAddress()).toStrictEqual(expected.addresses[interpreterCall]);
        expect(instruction.getOpcode()).toStrictEqual(expected.opcodes[interpreterCall]);
        expect(instruction.getOperands()).toStrictEqual(expected.operands[interpreterCall]);

        return expected.statuses[interpreterCall++];
    };
    program.read = (address, size) => {
        const data = [];
        for (let i = 0; i < parseInt(size.format()); i++) {
            const value = programData[parseInt(address.format()) + i];
            data.push(value);
        }

        return new Data(data);
    };
    processor = new Processor(interpreter);
});

test('executes the given instructions in sequence and exits with given exit code', () => {
    expect(processor.run(program)).toBe(expectedExitStatus);
});

test('supports jumps', () => {
    expected.statuses = [
        new Status(new Address(4)),
        new Status(null, expectedExitStatus),
    ];
    expected.addresses = [
        new Address(0),
        new Address(4),
    ];
    expected.operandsSizes = [
        new Size(2),
        new Size(1),
    ];
    expected.opcodes = [
        new Opcode(programData.slice(0, 1)),
        new Opcode(programData.slice(4, 5)),
    ];
    expected.operands = [
        new Operands(programData.slice(1, 3)),
        new Operands(programData.slice(5, 6)),
    ];

    expect(processor.run(program)).toBe(expectedExitStatus);
});

test('wraps invalid address exception', () => {
    let expectedMessage = null;
    expected.statuses = [
        new Status(),
        new Status(),
        new Status(),
    ];
    program.read = (address, size) => {
        const data = [];
        for (let i = 0; i < parseInt(size.format()); i++) {
            const value = programData[parseInt(address.format()) + i];
            if (value === undefined) {
                expectedMessage = `Invalid address: ${address.format()}`;
                throw new InvalidAddressException(expectedMessage);
            }
            data.push(value);
        }

        return new Data(data);
    };

    let thrown = false;
    try {
        processor.run(program);
    } catch (e) {
        thrown = true;
        expect(e).toBeInstanceOf(ProcessorException);
        expect(e.message).toBe(expectedMessage);
    }
    expect(thrown).toBe(true);
});

test('wraps read out of bounds exception', () => {
    let expectedMessage = null;
    expected.statuses = [
        new Status(),
        new Status(),
        new Status(),
    ];
    program.read = (address, size) => {
        const data = [];
        for (let i = 0; i < parseInt(size.format()); i++) {
            const value = programData[parseInt(address.format()) + i];
            if (value === undefined) {
                expectedMessage = `Read out of bounds: ${size.format()} units at address ${address.format()}`;
                throw new ReadOutOfBoundsException(expectedMessage);
            }
            data.push(value);
        }

        return new Data(data);
    };

    let thrown = false;
    try {
        processor.run(program);
    } catch (e) {
        thrown = true;
        expect(e).toBeInstanceOf(ProcessorException);
        expect(e.message).toBe(expectedMessage);
    }
    expect(thrown).toBe(true);
});

test('wraps interpreter exceptions', () => {
    let expectedMessage = 'message';
    interpreter.exec = () => {
        throw new InterpreterException(expectedMessage);
    };

    expect.assertions(2);
    try {
        processor.run(program);
    } catch (e) {
        expect(e).toBeInstanceOf(ProcessorException);
        expect(e.message).toBe(expectedMessage);
    }
});

test('forwards generic exceptions', () => {
    let expectedMessage = 'message';
    program.read = () => {
        throw new Error(expectedMessage);
    };

    expect.assertions(2);
    try {
        processor.run(program);
    } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toBe(expectedMessage);
    }
});
