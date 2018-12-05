const Subm = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Subm');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const Memory = require('../../../../../src/ProcessorInterfaces/Memory');
const Word = require('../../../../../src/DataTypes/Word');
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
 * @type {null|Subm}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Subm(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Subm.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements add register to memory', () => {
    const regs = [Register.al, Register.ax, Register.eax];

    for (const index in regs) {
        const register = regs[index];
        const registerAddress = new RegisterAddress(register);
        const type = registerAddress.getType();
        const right = random(type);
        const left = random(type, parseInt(right));
        const mem = random(Word);

        registers.get = reg => reg.eq(registerAddress) ? left : null;
        memory.read = (addr, size) => addr.eq(mem) && size.eq(type.SIZE) ? right.expand() : null;

        definition.exec(register, ...mem.expand());

        expect(registers.set.mock.calls[index][0]).toStrictEqual(registerAddress);
        expect(registers.set.mock.calls[index][1]).toStrictEqual(left.sub(right));
    }
});
