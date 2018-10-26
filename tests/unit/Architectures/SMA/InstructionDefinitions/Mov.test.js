const Mov = require('../../../../../src/Architectures/SMA/InstructionDefinitions/Mov');
const Byte = require('../../../../../src/DataTypes/Byte');
const Double = require('../../../../../src/DataTypes/Double');
const random = require('../../../random');
const Register = require('../../../../../src/Architectures/SMA/Mnemonics').register;
const RegisterAddress = require('../../../../../src/Architectures/SMA/RegisterAddress');

/**
 * @type {Object}
 */
const registers = {};

/**
 * @type {Object}
 */
const provider = {};

/**
 * @type {null|Mov}
 */
let definition = null;

beforeEach(() => {
    registers.set = jest.fn();
    provider.getRegisters = () => registers;
    definition = new Mov(provider);
});

test('implements move register to register', () => {
    const value = new Double(random(Double));

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
        const source = new RegisterAddress(Register[second]).format();
        const target = new RegisterAddress(Register[first]).format();

        expect(() => definition.exec(Register[first], Register[second], new Byte(0x00)))
            .toThrow(`Cannot move register ${source} to register ${target}`);
    }
});
