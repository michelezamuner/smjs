const Add = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Add');
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
 * @type {null|Add}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Add(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Add.getDependencies()).toStrictEqual([Registers]);
});

test('implements add register to register', () => {
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
        const left = new type(random(type, 0, parseInt(right)));

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
        expect(registers.set.mock.calls[index][1]).toStrictEqual(new type(parseInt(left) + parseInt(right)));
    }
});
