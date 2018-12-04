const Reti = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Reti');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
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
const stack = {};

/**
 * @type {null|Reti}
 */
let definition = null;

beforeEach(() => {
    registers.setIp = jest.fn();
    definition = new Reti(registers, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Reti.getDependencies()).toStrictEqual([Registers, Stack]);
});

test('pops stack frame and jumps to the return address pushing immediate as return value', () => {
    const returnAddress = random(Word);
    const returnValue = random(Word);
    let isFramePopped = false;

    stack.popFrame = () => {
        isFramePopped = true;
        return returnAddress;
    };

    stack.push = jest.fn(() => {
        expect(isFramePopped).toBe(true);
    });

    definition.exec(...returnValue.expand());

    expect(registers.setIp.mock.calls[0][0]).toStrictEqual(returnAddress);
    expect(stack.push.mock.calls[0][0]).toStrictEqual(returnValue);
});
