const Movipd = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movipd');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const random = require('../../../random');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {Object}
 */
const provider = {};

/**
 * @type {null|Movipd}
 */
let definition = null;

beforeEach(() => {
    memory.write = jest.fn();
    provider.getRegisters = () => registers;
    provider.getMemory = () => memory;
    definition = new Movipd(provider);
});

test('implements move immediate to byte register pointer', () => {
    const value = new Word(random(Word));
    const bytes = value.expand();
    const address = new Word(random(Word));

    registers.get = reg => reg.eq(new RegisterAddress(Register.ax)) ? address : null;

    definition.exec(Register.ax, ...bytes);

    expect(memory.write.mock.calls[0][0]).toStrictEqual(address);
    expect(memory.write.mock.calls[0][1]).toStrictEqual(new Byte(0x00));
    expect(memory.write.mock.calls[1][0]).toStrictEqual(address.add(new Byte(0x01)));
    expect(memory.write.mock.calls[1][1]).toStrictEqual(new Byte(0x00));
    expect(memory.write.mock.calls[2][0]).toStrictEqual(address.add(new Byte(0x02)));
    expect(memory.write.mock.calls[2][1]).toStrictEqual(bytes[0]);
    expect(memory.write.mock.calls[3][0]).toStrictEqual(address.add(new Byte(0x03)));
    expect(memory.write.mock.calls[3][1]).toStrictEqual(bytes[1]);
});
