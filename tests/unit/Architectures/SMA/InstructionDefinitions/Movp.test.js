const Movp = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movp');
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
 * @type {null|Movp}
 */
let definition = null;

beforeEach(() => {
    provider.getRegisters = () => registers;
    provider.getMemory = () => memory;
    definition = new Movp(provider);
});

test('implements move register pointer to register', () => {
    for (const reg of [Register.al, Register.ax, Register.eax]) {
        registers.set = jest.fn();
        const type = new RegisterAddress(reg).getType();
        const value = new type(random(type));
        const mem = new Word(random(Word));

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
            .toThrow(`Cannot use register ${new RegisterAddress(register).format()} as pointer`);
    }
});
