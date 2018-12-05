const Pushmd = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Pushmd');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Stack = require('../../../../../src/Architectures/SMA/Stack');
const Word = require('../../../../../src/DataTypes/Word');
const Double = require('../../../../../src/DataTypes/Double');
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
 * @type {null|Pushmd}
 */
let definition = null;

beforeEach(() => {
    stack.push = jest.fn();
    definition = new Pushmd(memory, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependecies', () => {
    expect(Pushmd.getDependencies()).toStrictEqual([Memory, Stack]);
});

test('pushes memory double value to the stack', () => {
    const addr = random(Word);
    const value = random(Double);

    memory.readSet = (mem, size) => mem.eq(addr) && size.eq(Double.SIZE) ? value.expand() : null;

    definition.exec(...addr.expand());

    expect(stack.push.mock.calls[0][0]).toStrictEqual(value);
});
