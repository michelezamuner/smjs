const Retr = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Retr');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Stack = require('../../../../../src/Architectures/SMA/Stack');
const Word = require('../../../../../src/DataTypes/Word');
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
 * @type {null|Retr}
 */
let definition = null;

beforeEach(() => {
    definition = new Retr(registers, stack);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Retr.getDependencies()).toStrictEqual([Registers, Stack]);
});

test('pops stack frame and jumps to the return address pushing register as return value', () => {
    for (const register of [Register.al, Register.bx, Register.ecx]) {
        registers.setIp = jest.fn();
        const returnAddress = new Word(random(Word));
        const registerAddress = new RegisterAddress(register);
        const type = registerAddress.getType();
        const returnValue = new type(random(type));
        let isFramePopped = false;

        registers.get = reg => reg.eq(registerAddress) ? returnValue : null;

        stack.popFrame = () => {
            isFramePopped = true;
            return returnAddress;
        };

        stack.push = jest.fn(() => {
            expect(isFramePopped).toBe(true);
        });

        definition.exec(register);

        expect(registers.setIp.mock.calls[0][0]).toStrictEqual(returnAddress);
        expect(stack.push.mock.calls[0][0]).toStrictEqual(returnValue);
    }
});
