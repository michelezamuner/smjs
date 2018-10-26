const Movm = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movm');
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
 * @type {null|Movm}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    provider.getRegisters = () => registers;
    provider.getMemory = () => memory;
    definition = new Movm(provider);
});

test('implements move memory to register', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        registers.set = jest.fn();
        const mem = new Word(random(Word));
        const type = new RegisterAddress(register).getType();
        const value = new type(random(type));

        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? value.expand() : null;

        definition.exec(register, ...mem.expand());

        expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(register));
        expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
    }
});
