const RegistersFactory = require('../../../src/Registers/RegistersFactory');
const Registers = require('../../../src/Registers/Registers');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const Double = require('../../../src/DataTypes/Double');

/**
 * @type {null|RegistersFactory}
 */
let factory = null;

beforeEach(() => {
    factory = new RegistersFactory;
});

test('creates new registers according to configuration', () => {
    const registers = factory.create({
        eax: Word,
        ebx: Word,
        ir: Double,
        et: Byte,
    });

    expect(registers).toBeInstanceOf(Registers);
    expect(registers.eax).toBeDefined();
    expect(registers.ebx).toBeDefined();
    expect(registers.ir).toBeDefined();
    expect(registers.et).toBeDefined();
});
