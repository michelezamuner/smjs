const Cmp = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Cmp');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const Byte = require('../../../../../src/DataTypes/Byte');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Cmp}
 */
let definition = null;

beforeEach(() => {
    registers.setFlag = jest.fn();
    definition = new Cmp(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Cmp.getDependencies()).toStrictEqual([Registers]);
});

test('implements compare register to register', () => {
    const couples = [
        [Register.ah, Register.bl],
        [Register.cx, Register.dx],
        [Register.eax, Register.ecx],
    ];

    for (const index in couples) {
        const first = couples[index][0];
        const second = couples[index][1];
        const firstAddress = new RegisterAddress(first);
        const secondAddress = new RegisterAddress(second);
        const type = firstAddress.getType();
        const value = random(type, 1, 1);

        registers.get = reg => reg.eq(firstAddress) || reg.eq(secondAddress) ? new type(value) : null;
        definition.exec(first, second, new Byte(0x00));

        expect(registers.setFlag.mock.calls[index * 9][0]).toStrictEqual(Registers.FLAG_EQ);
        expect(registers.setFlag.mock.calls[index * 9][1]).toStrictEqual(true);
        expect(registers.setFlag.mock.calls[index * 9 + 1][0]).toStrictEqual(Registers.FLAG_LT);
        expect(registers.setFlag.mock.calls[index * 9 + 1][1]).toStrictEqual(false);
        expect(registers.setFlag.mock.calls[index * 9 + 2][0]).toStrictEqual(Registers.FLAG_GT);
        expect(registers.setFlag.mock.calls[index * 9 + 2][1]).toStrictEqual(false);

        registers.get = reg => {
            if (reg.eq(firstAddress)) {
                return new type(value - 1);
            } else if (reg.eq(secondAddress)) {
                return new type(value);
            }

            return null;
        };
        definition.exec(first, second, new Byte(0x00));

        expect(registers.setFlag.mock.calls[index * 9 + 3][0]).toStrictEqual(Registers.FLAG_EQ);
        expect(registers.setFlag.mock.calls[index * 9 + 3][1]).toStrictEqual(false);
        expect(registers.setFlag.mock.calls[index * 9 + 4][0]).toStrictEqual(Registers.FLAG_LT);
        expect(registers.setFlag.mock.calls[index * 9 + 4][1]).toStrictEqual(true);
        expect(registers.setFlag.mock.calls[index * 9 + 5][0]).toStrictEqual(Registers.FLAG_GT);
        expect(registers.setFlag.mock.calls[index * 9 + 5][1]).toStrictEqual(false);

        registers.get = reg => {
            if (reg.eq(firstAddress)) {
                return new type(value + 1);
            } else if (reg.eq(secondAddress)) {
                return new type(value);
            }

            return null;
        };
        definition.exec(first, second, new Byte(0x00));

        expect(registers.setFlag.mock.calls[index * 9 + 6][0]).toStrictEqual(Registers.FLAG_EQ);
        expect(registers.setFlag.mock.calls[index * 9 + 6][1]).toStrictEqual(false);
        expect(registers.setFlag.mock.calls[index * 9 + 7][0]).toStrictEqual(Registers.FLAG_LT);
        expect(registers.setFlag.mock.calls[index * 9 + 7][1]).toStrictEqual(false);
        expect(registers.setFlag.mock.calls[index * 9 + 8][0]).toStrictEqual(Registers.FLAG_GT);
        expect(registers.setFlag.mock.calls[index * 9 + 8][1]).toStrictEqual(true);
    }
});

test('fails if trying to compare registers of different size', () => {
    const forbidden = [
        [Register.al, Register.bx],
        [Register.bh, Register.edx],
        [Register.cx, Register.dl],
        [Register.dx, Register.eax],
        [Register.ebx, Register.ch],
        [Register.ecx, Register.dx],
    ];

    for (const couple of forbidden) {
        const first = couple[0];
        const second = couple[1];
        const firstAddress = new RegisterAddress(first);
        const secondAddress = new RegisterAddress(second);

        expect(() => definition.exec(first, second, new Byte(0x00)))
            .toThrow(new Error(`Type mismatch: cannot compare register ${firstAddress} to register ${secondAddress}`));
    }
});
