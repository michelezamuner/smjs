const Movp = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movp');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Byte = require('../../../../../src/DataTypes/Byte');
const Word = require('../../../../../src/DataTypes/Word');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
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
 * @type {null|Movp}
 */
let definition = null;

beforeEach(() => {
    definition = new Movp(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Movp.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements move register pointer to register', () => {
    for (const reg of [Register.al, Register.ax, Register.eax]) {
        registers.set = jest.fn();
        const type = new RegisterAddress(reg).getType();
        const value = random(type);
        const mem = random(Word);

        registers.get = reg => reg.eq(new RegisterAddress(Register.bx)) ? mem : null;
        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? value.expand() : null;

        definition.exec(reg, Register.bx, new Byte(0x00));

        expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(reg));
        expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
    }
});

test('fails if size mismatch on move register pointer to register', () => {
    const forbidden = [
        Register.ah, Register.al, Register.eax,
        Register.bh, Register.bl, Register.ebx,
        Register.ch, Register.cl, Register.ecx,
        Register.dh, Register.dl, Register.edx,
    ];
    for (const register of forbidden) {
        expect(() => definition.exec(Register.eax, register, new Byte(0x00)))
            .toThrow(`Cannot use register ${new RegisterAddress(register)} as pointer`);
    }
});
