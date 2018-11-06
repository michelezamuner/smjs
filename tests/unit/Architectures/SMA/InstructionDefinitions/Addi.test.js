const Addi = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Addi');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const Word = require('../../../../../src/DataTypes/Word');
const Byte = require('../../../../../src/DataTypes/Byte');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Addi}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Addi(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Addi.getDependencies()).toStrictEqual([Registers]);
});

test('implements add register to immediate', () => {
    const regs = [Register.al, Register.ax, Register.eax];
    for (const index in regs) {
        const register = regs[index];
        const registerAddress = new RegisterAddress(register);
        const type = registerAddress.getType();
        const right = type === Byte ? new Word(random(Byte)) : new Word(random(Word));
        const left = new type(random(type, 0, parseInt(right)));
        const result = parseInt(left) + parseInt(right);

        registers.get = reg => reg.eq(registerAddress) ? left : null;

        definition.exec(register, ...right.expand());

        expect(registers.set.mock.calls[index][0]).toStrictEqual(registerAddress);
        expect(registers.set.mock.calls[index][1]).toStrictEqual(new type(result));
    }
});
