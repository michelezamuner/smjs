const Movimp = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movimp');
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
const provider = {};

/**
 * @type {null|Movimp}
 */
let definition = null;

beforeEach(() => {
    memory.write = jest.fn();
    provider.getMemory = () => memory;
    definition = new Movimp(provider);
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
