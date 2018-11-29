const Pop = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Pop');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const Stack = require('../../../../../src/Architectures/SMA/Stack');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const stack = {};

/**
 * @type {null|Pop}
 */
let definition = null;

beforeEach(() => {
    definition = new Pop(registers, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Pop.getDependencies()).toStrictEqual([Registers, Stack]);
});

test('pops values into registers', () => {
    for (const register of [Register.al, Register.bx, Register.ecx]) {
        registers.set = jest.fn();
        const registerAddress = new RegisterAddress(register);
        const type = registerAddress.getType();
        const value = new type(random(type));

        stack.pop = poppedType => poppedType === type ? value : null;

        definition.exec(register);

        expect(registers.set.mock.calls[0][0]).toStrictEqual(registerAddress);
        expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
    }
});
