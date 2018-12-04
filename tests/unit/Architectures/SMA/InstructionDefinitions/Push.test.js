const Push = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Push');
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
 * @type {null|Push}
 */
let definition = null;

beforeEach(() => {
    definition = new Push(registers, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependecies', () => {
    expect(Push.getDependencies()).toStrictEqual([Registers, Stack]);
});

test('pushes register values to the stack', () => {
    for (const register of [Register.al, Register.bx, Register.ecx]) {
        stack.push = jest.fn();
        const registerAddress = new RegisterAddress(register);
        const type = registerAddress.getType();
        const value = random(type);

        registers.get = addr => addr.eq(registerAddress) ? value : null;

        definition.exec(register);

        expect(stack.push.mock.calls[0][0]).toStrictEqual(value);
    }
});
