const Movi = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movi');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const Double = require('../../../../../src/DataTypes/Double');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Movi}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Movi(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Movi.getDependencies()).toStrictEqual([Registers]);
});

test('implements move immediate to register', () => {
    const value = random(Word);
    const bytes = value.expand();

    definition.exec(Register.al, ...bytes);
    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Register.al));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(bytes[1]);

    definition.exec(Register.ax, ...bytes);
    expect(registers.set.mock.calls[1][0]).toStrictEqual(new RegisterAddress(Register.ax));
    expect(registers.set.mock.calls[1][1]).toStrictEqual(value);

    definition.exec(Register.eax, ...bytes);
    expect(registers.set.mock.calls[2][0]).toStrictEqual(new RegisterAddress(Register.eax));
    expect(registers.set.mock.calls[2][1]).toStrictEqual((new Word(...bytes)).cast(Double));
});
