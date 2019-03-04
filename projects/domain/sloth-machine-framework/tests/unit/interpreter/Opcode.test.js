const Opcode = require('../../../src/interpreter/Opcode');
const Data = require('../../../src/data/Data');

test('extends data', () => {
    expect(new Opcode()).toBeInstanceOf(Data);
});
