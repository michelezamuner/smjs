const Mov = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Mov');
const Definition = require('../../../../../src/Architectures/SMA/InstructionSet/Definition');
const Registers = require('../../../../../src/Architectures/SMA/Registers');
const Byte = require('../../../../../src/DataTypes/Byte');
const Double = require('../../../../../src/DataTypes/Double');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');
const random = require('../../../random');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {null|Mov}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    definition = new Mov(registers);
});

test('implements definition', () => {
    expect(definition).toBeInstanceOf(Definition);
});

test('implements get dependencies', () => {
    expect(Mov.getDependencies()).toStrictEqual([Registers]);
});

test('implements move register to register', () => {
    const value = random(Double);

    registers.get = addr => addr.eq(new RegisterAddress(Register.ebx)) ? value : null;

    definition.exec(Register.eax, Register.ebx, new Byte(0x00));

    expect(registers.set.mock.calls[0][0]).toStrictEqual(new RegisterAddress(Register.eax));
    expect(registers.set.mock.calls[0][1]).toStrictEqual(value);
});

test('fails if size mismatch on move register to register', () => {
    const combinations = [
        ['al', 'bx'], ['al', 'ebx'], ['ah', 'bx'], ['ah', 'ebx'],
        ['ax', 'bl'], ['ax', 'bh'], ['ax', 'ebx'], ['eax', 'bl'],
        ['eax', 'bh'], ['eax', 'bx']
    ];
    for (const [first, second] of combinations) {
        const source = new RegisterAddress(Register[second]).toString();
        const target = new RegisterAddress(Register[first]).toString();

        expect(() => definition.exec(Register[first], Register[second], new Byte(0x00)))
            .toThrow(`Cannot move register ${source} to register ${target}`);
    }
});
