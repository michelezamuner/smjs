const Inc = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Inc');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Inc}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Inc(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Inc.getDependencies()).toStrictEqual([Registers]);
});

test('implements increment', () => {
    const regs = [Register.ah, Register.bx, Register.ecx];
    for (const index in regs) {
        const register = regs[index];
        const registerAddress = new RegisterAddress(register);
        const type = registerAddress.getType();
        const value = new type(random(type, 0, 1));

        registers.get = reg => reg.eq(registerAddress) ? value : null;

        definition.exec(register);

        expect(registers.set.mock.calls[index][0]).toStrictEqual(registerAddress);
        expect(registers.set.mock.calls[index][1]).toStrictEqual(new type(parseInt(value) + 1));
    }
});
