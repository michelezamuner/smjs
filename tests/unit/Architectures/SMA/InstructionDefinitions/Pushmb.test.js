const Pushmb = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Pushmb');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Stack = require('../../../../../src/Architectures/SMA/Stack');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {Object}
 */
const stack = {};

/**
 * @type {null|Pushmb}
 */
let definition = null;

beforeEach(() => {
    stack.push = jest.fn();
    definition = new Pushmb(memory, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependecies', () => {
    expect(Pushmb.getDependencies()).toStrictEqual([Memory, Stack]);
});

test('pushes memory byte value to the stack', () => {
    const addr = random(Word);
    const value = random(Byte);

    memory.read = mem => mem.eq(addr) ? value : null;

    definition.exec(...addr.expand());

    expect(stack.push.mock.calls[0][0]).toStrictEqual(value);
});
