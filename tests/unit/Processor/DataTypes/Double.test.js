const Double = require('../../../../src/Processor/DataTypes/Double');
const DataType = require('../../../../src/Processor/DataTypes/DataType');

test('implements data type', () => {
    const random = Math.floor(Math.random() * Double.MAX);
    const d = new Double(random);
    expect(d instanceof DataType).toBe(true);
});

test('holds up to 32 bits', () => {
    expect(Double.MAX).toBe(4294967295);
});
