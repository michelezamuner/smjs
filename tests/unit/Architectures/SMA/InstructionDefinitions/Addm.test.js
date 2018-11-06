const Addm = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Addm');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
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
 * @type {null|Addm}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Addm(registers, memory);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Addm.getDependencies()).toStrictEqual([Registers, Memory]);
});

test('implements add register to memory', () => {
    const regs = [Register.al, Register.ax, Register.eax];

    for (const index in regs) {
        const register = regs[index];
        const registerAddress = new RegisterAddress(register);
        const type = registerAddress.getType();
        const right = new type(random(type));
        const left = new type(random(type, 0, parseInt(right)));
        const mem = new Word(random(Word));

        registers.get = reg => reg.eq(registerAddress) ? left : null;
        memory.readSet = (addr, size) => addr.eq(mem) && size.eq(new Byte(type.SIZE)) ? right.expand() : null;

        definition.exec(register, ...mem.expand());

        expect(registers.set.mock.calls[index][0]).toStrictEqual(registerAddress);
        expect(registers.set.mock.calls[index][1]).toStrictEqual(new type(parseInt(left) + parseInt(right)));
    }
});
