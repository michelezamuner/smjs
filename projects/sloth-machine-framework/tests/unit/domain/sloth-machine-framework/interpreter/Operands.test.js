const Operands = require('../../../../../src/domain/sloth-machine-framework/interpreter/Operands');
const Data = require('../../../../../src/domain/sloth-machine-framework/data/Data');

test('extends data', () => {
    expect(new Operands()).toBeInstanceOf(Data);
});
