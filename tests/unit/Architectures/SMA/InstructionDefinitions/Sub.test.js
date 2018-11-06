const Sub = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Sub');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Sub}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Sub(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Sub.getDependencies()).toStrictEqual([Registers]);
});

test('implements subtract register from register', () => {
    const couples = [
        [Register.al, Register.bl],
        [Register.ax, Register.bx],
        [Register.eax, Register.ebx],
    ];
    for (const index in couples) {
        const couple = couples[index];
        const leftRegister = couple[0];
        const rightRegister = couple[1];
        const leftRegisterAddress = new RegisterAddress(leftRegister);
        const rightRegisterAddress = new RegisterAddress(rightRegister);
        const type = leftRegisterAddress.getType();
        const right = new type(random(type));
        const left = new type(random(type, parseInt(right)));

        registers.get = reg => {
            if (reg.eq(leftRegisterAddress)) {
                return left;
            } else if (reg.eq(rightRegisterAddress)) {
                return right;
            }

            return null;
        };

        definition.exec(leftRegister, rightRegister);

        expect(registers.set.mock.calls[index][0]).toStrictEqual(leftRegisterAddress);
        expect(registers.set.mock.calls[index][1]).toStrictEqual(new type(parseInt(left) - parseInt(right)));
    }
});
