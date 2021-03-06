const Retmw = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Retmw');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Stack = require('../../../../../src/Architectures/SMA/Stack');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {Object}
 */
const stack = {};

/**
 * @type {null|Retmw}
 */
let definition = null;

beforeEach(() => {
    registers.setIp = jest.fn();
    definition = new Retmw(registers, memory, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Retmw.getDependencies()).toStrictEqual([Registers, Memory, Stack]);
});

test('pops stack frame and jumps to the return address pushing memory byte as return value', () => {
    const returnAddress = random(Word);
    const returnValueAddress = random(Word);
    const returnValue = random(Word);
    let isFramePopped = false;

    stack.popFrame = () => {
        isFramePopped = true;
        return returnAddress;
    };

    stack.push = jest.fn(() => {
        expect(isFramePopped).toBe(true);
    });

    memory.read = (addr, size) => addr.eq(returnValueAddress) && size.eq(Word.SIZE) ? returnValue.expand() : null;

    definition.exec(...returnValueAddress.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(returnAddress);
    expect(stack.push.mock.calls[0][0]).toStrictEqual(returnValue);
});
