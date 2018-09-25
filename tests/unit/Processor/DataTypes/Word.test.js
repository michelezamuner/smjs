const DataType = require('../../../../src/Processor/DataTypes/DataType');
const Word = require('../../../../src/Processor/DataTypes/Word');
const Byte = require('../../../../src/Processor/DataTypes/Byte');

test('implements data type', () => {
    const random = Math.floor(Math.random() * Word.MAX);
    const w = new Word(random);
    expect(w instanceof DataType).toBe(true);
});

test('can be constructed from two bytes', () => {
    const w = new Word(new Byte(0x01), new Byte(0x02));
    expect(w.equals(new Word(0x0102))).toBe(true);
});

test('if constructing with two arguments, they must be both Bytes', () => {
    expect(() => new Word(10, new Byte(10))).toThrow('Word must be constructed with one integer or two bytes');
    expect(() => new Word(new Byte(10), 10)).toThrow('Word must be constructed with one integer or two bytes');
    expect(() => new Word(10, 10)).toThrow('Word must be constructed with one integer or two bytes');
});
