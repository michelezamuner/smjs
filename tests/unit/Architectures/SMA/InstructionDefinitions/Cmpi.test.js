const Cmpi = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Cmpi');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const random = require('../../../random');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const Double = require('../../../../../src/DataTypes/Double');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Cmp}
 */
let definition = null;

beforeEach(() => {
    registers.setFlag = jest.fn();
    definition = new Cmpi(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Cmpi.getDependencies()).toStrictEqual([Registers]);
});

test('implements compare register byte to immediate', () => {
    const register = Register.al;
    const value = random(Byte, 1, 1);

    registers.get = reg => reg.eq(new RegisterAddress(register)) ? new Byte(value) : null;
    definition.exec(register, new Byte(0x00), new Byte(value));

    expect(registers.setFlag.mock.calls[0][0]).toStrictEqual(Registers.FLAG_EQ);
    expect(registers.setFlag.mock.calls[0][1]).toStrictEqual(true);
    expect(registers.setFlag.mock.calls[1][0]).toStrictEqual(Registers.FLAG_LT);
    expect(registers.setFlag.mock.calls[1][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[2][0]).toStrictEqual(Registers.FLAG_GT);
    expect(registers.setFlag.mock.calls[2][1]).toStrictEqual(false);

    registers.get = reg => reg.eq(new RegisterAddress(register)) ? new Byte(value - 1) : null;
    definition.exec(register, new Byte(0x00), new Byte(value));

    expect(registers.setFlag.mock.calls[3][0]).toStrictEqual(Registers.FLAG_EQ);
    expect(registers.setFlag.mock.calls[3][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[4][0]).toStrictEqual(Registers.FLAG_LT);
    expect(registers.setFlag.mock.calls[4][1]).toStrictEqual(true);
    expect(registers.setFlag.mock.calls[5][0]).toStrictEqual(Registers.FLAG_GT);
    expect(registers.setFlag.mock.calls[5][1]).toStrictEqual(false);

    registers.get = reg => reg.eq(new RegisterAddress(register)) ? new Byte(value + 1) : null;
    definition.exec(register, new Byte(0x00), new Byte(value));

    expect(registers.setFlag.mock.calls[6][0]).toStrictEqual(Registers.FLAG_EQ);
    expect(registers.setFlag.mock.calls[6][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[7][0]).toStrictEqual(Registers.FLAG_LT);
    expect(registers.setFlag.mock.calls[7][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[8][0]).toStrictEqual(Registers.FLAG_GT);
    expect(registers.setFlag.mock.calls[8][1]).toStrictEqual(true);
});

test('implements compare register word to immediate', () => {
    const register = Register.ax;
    const value = random(Word, 1, 1);

    registers.get = reg => reg.eq(new RegisterAddress(register)) ? new Word(value) : null;
    definition.exec(register, ...(new Word(value)).expand());

    expect(registers.setFlag.mock.calls[0][0]).toStrictEqual(Registers.FLAG_EQ);
    expect(registers.setFlag.mock.calls[0][1]).toStrictEqual(true);
    expect(registers.setFlag.mock.calls[1][0]).toStrictEqual(Registers.FLAG_LT);
    expect(registers.setFlag.mock.calls[1][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[2][0]).toStrictEqual(Registers.FLAG_GT);
    expect(registers.setFlag.mock.calls[2][1]).toStrictEqual(false);

    registers.get = reg => reg.eq(new RegisterAddress(register)) ? new Word(value - 1) : null;
    definition.exec(register, ...(new Word(value)).expand());

    expect(registers.setFlag.mock.calls[3][0]).toStrictEqual(Registers.FLAG_EQ);
    expect(registers.setFlag.mock.calls[3][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[4][0]).toStrictEqual(Registers.FLAG_LT);
    expect(registers.setFlag.mock.calls[4][1]).toStrictEqual(true);
    expect(registers.setFlag.mock.calls[5][0]).toStrictEqual(Registers.FLAG_GT);
    expect(registers.setFlag.mock.calls[5][1]).toStrictEqual(false);

    registers.get = reg => reg.eq(new RegisterAddress(register)) ? new Word(value + 1) : null;
    definition.exec(register, ...(new Word(value)).expand());

    expect(registers.setFlag.mock.calls[6][0]).toStrictEqual(Registers.FLAG_EQ);
    expect(registers.setFlag.mock.calls[6][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[7][0]).toStrictEqual(Registers.FLAG_LT);
    expect(registers.setFlag.mock.calls[7][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[8][0]).toStrictEqual(Registers.FLAG_GT);
    expect(registers.setFlag.mock.calls[8][1]).toStrictEqual(true);
});

test('implements compare register double to immediate', () => {
    const register = Register.eax;
    const value = random(Word, 1, 1);

    registers.get = reg => reg.eq(new RegisterAddress(register)) ? new Double(value) : null;
    definition.exec(register, ...(new Word(value)).expand());

    expect(registers.setFlag.mock.calls[0][0]).toStrictEqual(Registers.FLAG_EQ);
    expect(registers.setFlag.mock.calls[0][1]).toStrictEqual(true);
    expect(registers.setFlag.mock.calls[1][0]).toStrictEqual(Registers.FLAG_LT);
    expect(registers.setFlag.mock.calls[1][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[2][0]).toStrictEqual(Registers.FLAG_GT);
    expect(registers.setFlag.mock.calls[2][1]).toStrictEqual(false);

    registers.get = reg => reg.eq(new RegisterAddress(register)) ? new Double(value - 1) : null;
    definition.exec(register, ...(new Word(value)).expand());

    expect(registers.setFlag.mock.calls[3][0]).toStrictEqual(Registers.FLAG_EQ);
    expect(registers.setFlag.mock.calls[3][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[4][0]).toStrictEqual(Registers.FLAG_LT);
    expect(registers.setFlag.mock.calls[4][1]).toStrictEqual(true);
    expect(registers.setFlag.mock.calls[5][0]).toStrictEqual(Registers.FLAG_GT);
    expect(registers.setFlag.mock.calls[5][1]).toStrictEqual(false);

    registers.get = reg => reg.eq(new RegisterAddress(register)) ? new Double(value + 1) : null;
    definition.exec(register, ...(new Word(value)).expand());

    expect(registers.setFlag.mock.calls[6][0]).toStrictEqual(Registers.FLAG_EQ);
    expect(registers.setFlag.mock.calls[6][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[7][0]).toStrictEqual(Registers.FLAG_LT);
    expect(registers.setFlag.mock.calls[7][1]).toStrictEqual(false);
    expect(registers.setFlag.mock.calls[8][0]).toStrictEqual(Registers.FLAG_GT);
    expect(registers.setFlag.mock.calls[8][1]).toStrictEqual(true);
});
