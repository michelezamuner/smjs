const Normalizer = require('../../../src/DataTypes/Normalizer');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const Double = require('../../../src/DataTypes/Double');
const random = require('../random');

/**
 * @type {null|Normalizer}
 */
let normalizer = null;

beforeEach(() => {
    normalizer = new Normalizer;
});

test('normalizes bytes', () => {
    const byte = new Byte(random(Byte));
    expect(normalizer.normalize(byte)).toEqual([byte]);
});

test('normalizes words', () => {
    const bytes = [new Byte(random(Byte)), new Byte(random(Byte))];
    const word = new Word(...bytes);
    expect(normalizer.normalize(word)).toEqual(bytes);
});

test('normalizes doubles', () => {
    const bytes = [new Byte(random(Byte)), new Byte(random(Byte)), new Byte(random(Byte)), new Byte(random(Byte))];
    const double = new Double(...bytes);
    expect(normalizer.normalize(double)).toEqual(bytes);
});
