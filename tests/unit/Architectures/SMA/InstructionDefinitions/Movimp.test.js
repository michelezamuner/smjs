const Movimp = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movimp');
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
 * @type {null|Movimp}
 */
let definition = null;

beforeEach(() => {
    memory.write = jest.fn();
    definition = new Movimp(memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Movimp.getDependencies()).toStrictEqual([Memory]);
});

test('implements move immediate to memory pointer', () => {
    const value = new Byte(random(Byte));
    const ptr = new Word(random(Word));
    const mem = new Word(random(Word));

    memory.readSet = (addr, size) => addr.eq(ptr) && size.eq(new Byte(0x02)) ? mem.expand() : null;

    definition.exec(...ptr.expand(), value);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(mem);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(value);
});
