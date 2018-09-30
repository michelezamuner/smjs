const Byte = require('../../../src/DataTypes/Byte');
const DataType = require('../../../src/DataTypes/DataType');
const random = require('../random');

test('implements data type', () => {
    const b = new Byte(random(Byte));
    expect(b instanceof DataType).toBe(true);
});

test('holds up to 1 byte', () => {
    expect(Byte.SIZE).toBe(1);
});

test('implements to signed int', () => {
    expect((new Byte(255)).toSignedInt()).toBe(-1);
});
