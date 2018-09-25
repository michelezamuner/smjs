const Byte = require('../../../../src/Processor/DataTypes/Byte');
const DataType = require('../../../../src/Processor/DataTypes/DataType');

test('implements data type', () => {
    const random = Math.floor(Math.random() * Byte.MAX);
    const b = new Byte(random);
    expect(b instanceof DataType).toBe(true);
});
