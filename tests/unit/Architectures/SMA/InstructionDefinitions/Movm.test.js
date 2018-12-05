const Movm = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Movm');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
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
 * @type {null|Movm}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Movm(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Movm.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements move memory to register', () => {
    for (const register of [Register.ah, Register.ax, Register.eax]) {
        registers.set = jest.fn();
        const mem = random(Word);
        const type = new RegisterAddress(register).getType();
        const value = random(type);

        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(type.SIZE) ? value.expand() : null;

        definition.exec(register, ...mem.expand());

        expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(register));
        expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
    }
});
