const Byte = require('../../../src/DataTypes/Byte');
const DataType = require('../../../src/DataTypes/DataType');
const random = require('../random');

test('implements data type', () => {
    const b = random(Byte);
    expect(b instanceof DataType).toBe(true);
});

test('defaults to zero', () => {
    expect(new Byte()).toStrictEqual(new Byte(0x00));
});

test('implements size', () => {
    expect(Byte.SIZE).toStrictEqual(new Byte(0x01));
});

test('implements unit type', () => {
    expect(Byte.UNIT_TYPE).toBe(Byte);
});

test('implements scalar size', () => {
    expect(Byte._SCALAR_SIZE).toBe(1);
});
