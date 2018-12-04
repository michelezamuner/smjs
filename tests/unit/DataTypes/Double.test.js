const DataType = require('../../../src/DataTypes/DataType');
const Double = require('../../../src/DataTypes/Double');
const Byte = require('../../../src/DataTypes/Byte');
const random = require('../random');

test('implements data type', () => {
    const d = random(Double);
    expect(d instanceof DataType).toBe(true);
});

test('defaults to zero', () => {
    expect(new Double()).toStrictEqual(new Double());
});

test('implements size', () => {
    expect(Double.SIZE).toBe(4);
});

test('implements unit type', () => {
    expect(Double.UNIT_TYPE).toBe(Byte);
});

test('can be constructed from four bytes', () => {
    let bytes = [new Byte(0x01), new Byte(0x02), new Byte(0x03), new Byte(0x04)];
    let expected = 16909060;
    expect(new Double(...bytes)).toStrictEqual(new Double(expected));

    bytes = [new Byte(0xFF), new Byte(0xAA), new Byte(0x51), new Byte(0x12)];
    expected = 4289351954;
    expect(new Double(...bytes)).toStrictEqual(new Double(expected));
});

test('if constructing with one argument, it must be integer or a double', () => {
    expect(new Double(new Double(0x01))).toStrictEqual(new Double(0x01));
    expect(() => new Double(new Byte(10))).toThrow(new Error('Double must be constructed from one value or four bytes'));
});

test('fails if constructing with more than one arguments, that are not four bytes', () => {
    expect(() => new Double(new Byte(10), 10, 10, 10))
        .toThrow(new Error('Double must be constructed from one value or four bytes'));
    expect(() => new Double(10, new Byte(10), new Byte(10), new Byte(10)))
        .toThrow(new Error('Double must be constructed from one value or four bytes'));
    expect(() => new Double(10, 10, 10, 10))
        .toThrow(new Error('Double must be constructed from one value or four bytes'));
    expect(() => new Double(new Byte(10), new Byte(10)))
        .toThrow(new Error('Double must be constructed from one value or four bytes'));
});
