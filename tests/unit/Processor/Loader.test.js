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
    memory.getMax = () => new Word(0);

    loader = new Loader(memory);
});

test('loads bytes into memory', () => {
    let bytes = '';
    for (let i = 0x00; i < 0xFF; i++) {
        bytes += String.fromCharCode(0xFF - i);
    }
    loader.load(bytes);

    expect(memory.write).toBeCalledTimes(0xFF);
    for (let i = 0x00; i < 0xFF; i++) {
        expect(memory.write).nthCalledWith(i + 1, new Byte(i), new Byte(0xFF - i));
    }
});
