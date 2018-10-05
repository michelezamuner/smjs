const DataType = require('../../../src/DataTypes/DataType');
const Double = require('../../../src/DataTypes/Double');
const Byte = require('../../../src/DataTypes/Byte');
const random = require('../random');

test('implements data type', () => {
    const d = new Double(random(Double));
    expect(d instanceof DataType).toBe(true);
});

test('implements max', () => {
    expect(Double.MAX).toBe(0xFFFFFFFF);
});

test('can be constructed from four bytes', () => {
    let bytes = [new Byte(0x01), new Byte(0x02), new Byte(0x03), new Byte(0x04)];
    let expected = 16909060;
    expect(new Double(...bytes)).toEqual(new Double(expected));

    bytes = [new Byte(0xFF), new Byte(0xAA), new Byte(0x51), new Byte(0x12)];
    expected = 4289351954;
    expect(new Double(...bytes)).toEqual(new Double(expected));
});

test('if constructing with one argument, it must be integer or a double', () => {
    expect(new Double(new Double(0x01))).toEqual(new Double(0x01));
    expect(() => new Double(new Byte(10))).toThrow('Double must be constructed from one value or four bytes');
});

test('fails if constructing with more than one arguments, that are not four bytes', () => {
    expect(() => new Double(new Byte(10), 10, 10, 10))
        .toThrow('Double must be constructed from one value or four bytes');
    expect(() => new Double(10, new Byte(10), new Byte(10), new Byte(10)))
        .toThrow('Double must be constructed from one value or four bytes');
    expect(() => new Double(10, 10, 10, 10))
        .toThrow('Double must be constructed from one value or four bytes');
    expect(() => new Double(new Byte(10), new Byte(10)))
        .toThrow('Double must be constructed from one value or four bytes');
});

test('can be cast to list of bytes', () => {
    const one = new Byte(random(Byte));
    const two = new Byte(random(Byte));
    const three = new Byte(random(Byte));
    const four = new Byte(random(Byte));

    expect(new Double(one, two, three, four).toBytes()).toEqual([one, two, three, four]);
});