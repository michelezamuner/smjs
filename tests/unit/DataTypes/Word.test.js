const DataType = require('../../../src/DataTypes/DataType');
const Word = require('../../../src/DataTypes/Word');
const Byte = require('../../../src/DataTypes/Byte');
const random = require('../random');

test('implements data type', () => {
    const w = new Word(random(Word));
    expect(w instanceof DataType).toBe(true);
});

test('implements max', () => {
    expect(Word.MAX).toBe(0xFFFF);
});

test('can be constructed from two bytes', () => {
    const w = new Word(new Byte(0x01), new Byte(0x02));
    expect(w.equals(new Word(0x0102))).toBe(true);
});

test('if constructing with one argument, it must be integer or a word', () => {
    expect(new Word(new Word(0x01))).toEqual(new Word(0x01));
    expect(() => new Word(new Byte(10))).toThrow('Word must be constructed from one value or two bytes');
});

test('if constructing with two arguments, they must be both Bytes', () => {
    expect(() => new Word(10, new Byte(10))).toThrow('Word must be constructed from one value or two bytes');
    expect(() => new Word(new Byte(10), 10)).toThrow('Word must be constructed from one value or two bytes');
    expect(() => new Word(10, 10)).toThrow('Word must be constructed from one value or two bytes');
});

test('can be cast to list of bytes', () => {
    const left = new Byte(random(Byte));
    const right = new Byte(random(Byte));

    expect((new Word(left, right)).toBytes()).toEqual([left, right]);
});
