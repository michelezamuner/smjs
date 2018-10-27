const Movim = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movim');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {null|Movim}
 */
let definition = null;

beforeEach(() => {
    memory.write = jest.fn();
    definition = new Movim(memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Movim.getDependencies()).toStrictEqual([Memory]);
});

test('implements move immediate to memory', () => {
    const value = new Byte(random(Byte));
    const mem = new Word(random(Word));

    definition.exec(...mem.expand(), value);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(mem);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(value);
});
