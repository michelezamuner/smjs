const Cmpm = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Cmpm');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Word = require('../../../../../src/DataTypes/Word');
const Byte = require('../../../../../src/DataTypes/Byte');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {null|Cmp}
 */
let definition = null;

beforeEach(() => {
    registers.setFlag = jest.fn();
    definition = new Cmpm(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Cmpm.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements compare register to memory', () => {
    const regs = [Register.al, Register.ax, Register.eax];

    for (const index in regs) {
        const register = regs[index];
        const registerAddress = new RegisterAddress(register);
        const type = registerAddress.getType();
        const value = random(type, 1, 1);
        const mem = new Word(random(Word));

        registers.get = reg => reg.eq(registerAddress) ? new type(value) : null;
        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? (new type(value)).expand() : null;

        definition.exec(register, ...mem.expand());

        expect(registers.setFlag.mock.calls[index * 9][0]).toStrictEqual(Registers.FLAG_EQ);
        expect(registers.setFlag.mock.calls[index * 9][1]).toStrictEqual(true);
        expect(registers.setFlag.mock.calls[index * 9 + 1][0]).toStrictEqual(Registers.FLAG_LT);
        expect(registers.setFlag.mock.calls[index * 9 + 1][1]).toStrictEqual(false);
        expect(registers.setFlag.mock.calls[index * 9 + 2][0]).toStrictEqual(Registers.FLAG_GT);
        expect(registers.setFlag.mock.calls[index * 9 + 2][1]).toStrictEqual(false);

        registers.get = reg => reg.eq(registerAddress) ? new type(value - 1) : null;
        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? (new type(value)).expand() : null;

        definition.exec(register, ...mem.expand());

        expect(registers.setFlag.mock.calls[index * 9 + 3][0]).toStrictEqual(Registers.FLAG_EQ);
        expect(registers.setFlag.mock.calls[index * 9 + 3][1]).toStrictEqual(false);
        expect(registers.setFlag.mock.calls[index * 9 + 4][0]).toStrictEqual(Registers.FLAG_LT);
        expect(registers.setFlag.mock.calls[index * 9 + 4][1]).toStrictEqual(true);
        expect(registers.setFlag.mock.calls[index * 9 + 5][0]).toStrictEqual(Registers.FLAG_GT);
        expect(registers.setFlag.mock.calls[index * 9 + 5][1]).toStrictEqual(false);

        registers.get = reg => reg.eq(registerAddress) ? new type(value + 1) : null;
        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? (new type(value)).expand() : null;

        definition.exec(register, ...mem.expand());

        expect(registers.setFlag.mock.calls[index * 9 + 6][0]).toStrictEqual(Registers.FLAG_EQ);
        expect(registers.setFlag.mock.calls[index * 9 + 6][1]).toStrictEqual(false);
        expect(registers.setFlag.mock.calls[index * 9 + 7][0]).toStrictEqual(Registers.FLAG_LT);
        expect(registers.setFlag.mock.calls[index * 9 + 7][1]).toStrictEqual(false);
        expect(registers.setFlag.mock.calls[index * 9 + 8][0]).toStrictEqual(Registers.FLAG_GT);
        expect(registers.setFlag.mock.calls[index * 9 + 8][1]).toStrictEqual(true);
    }
});

