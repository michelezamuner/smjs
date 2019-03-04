const Operands = require('../../../src/interpreter/Operands');
const Data = require('../../../src/data/Data');

test('extends data', () => {
    expect(new Operands()).toBeInstanceOf(Data);
});
