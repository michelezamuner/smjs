const Loader = require('../../../src/Processor/Loader');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {null|Loader}
 */
let loader = null;

beforeEach(() => {
    memory.write = jest.fn();
    memory.getMax = () => new Word();

    loader = new Loader(memory);
});

test('loads bytes into memory', () => {
    let chars = '';
    const bytes = [];
    for (let i = 0x00; i < 0xFF; i++) {
        chars += String.fromCharCode(0xFF - i);
        bytes.push(new Byte(0xFF - i));
    }

    loader.load(chars);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(new Word());
    expect(memory.write.mock.calls[0][1]).toStrictEqual(bytes);
});
