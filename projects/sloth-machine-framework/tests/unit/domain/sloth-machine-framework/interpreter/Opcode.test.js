const Opcode = require('../../../../../src/domain/sloth-machine-framework/interpreter/Opcode');
const Data = require('../../../../../src/domain/sloth-machine-framework/data/Data');

test('extends data', () => {
    expect(new Opcode()).toBeInstanceOf(Data);
});
