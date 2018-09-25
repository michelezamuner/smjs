const Word = require('../../../../src/Processor/DataTypes/Word');
const DataType = require('../../../../src/Processor/DataTypes/DataType');

test('implements data type', () => {
    const random = Math.floor(Math.random() * Word.MAX);
    const w = new Word(random);
    expect(w instanceof DataType).toBe(true);
});
