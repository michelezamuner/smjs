const Movim = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movim');
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
 * @type {null|Movim}
 */
let definition = null;

beforeEach(() => {
    memory.write = jest.fn();
    provider.getMemory = () => memory;
    definition = new Movim(provider);
});

test('implements move immediate to memory', () => {
    const value = new Byte(random(Byte));
    const mem = new Word(random(Word));

    definition.exec(...mem.expand(), value);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(mem);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(value);
});
