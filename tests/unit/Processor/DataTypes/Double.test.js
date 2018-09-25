const Double = require('../../../../src/Processor/DataTypes/Double');
const DataType = require('../../../../src/Processor/DataTypes/DataType');

test('implements data type', () => {
    const random = Math.floor(Math.random() * Double.MAX);
    const d = new Double(random);
    expect(d instanceof DataType).toBe(true);
});
