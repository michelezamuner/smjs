const Byte = require('../../../src/DataTypes/Byte');
const DataType = require('../../../src/DataTypes/DataType');
const random = require('../random');

test('implements data type', () => {
    const b = new Byte(random(Byte));
    expect(b instanceof DataType).toBe(true);
});

test('implements max', () => {
    expect(Byte.MAX).toBe(0xFF);
});
